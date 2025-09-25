import type React from "react";
import "./index.css";
import { useState, useEffect } from "react";
import type { ImageRecognitionResponse } from "../../models/Image";

function ImageForm() {
  const [invert, setInvert] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageResponse, setImageResponse] =
    useState<ImageRecognitionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Limpiar memoria cuando se cambie la imagen
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];

      // Validar formato
      if (!selectedImage.type.startsWith("image/")) {
        setError("El archivo debe ser una imagen válida.");
        return;
      }

      setImage(selectedImage);
      setError(null);

      const objectUrl = URL.createObjectURL(selectedImage);
      setPreview(objectUrl);
    }
  };

  const validateImageSize = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.width === 28 && img.height === 28);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!image) {
      setError("Debes subir una imagen para el reconocimiento.");
      setLoading(false);
      return;
    }

    const isValidSize = await validateImageSize(image);
    if (!isValidSize) {
      setError("La imagen debe ser de 28x28 píxeles.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("invert", invert ? "true" : "false");
    formData.append("image", image);

    fetch("http://ec2-54-81-142-28.compute-1.amazonaws.com:8080/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json() as Promise<ImageRecognitionResponse>;
      })
      .then((data) => {
        setImageResponse(data);

        // Guardar en localStorage
        const history = JSON.parse(localStorage.getItem("history") || "[]");
        history.push({
          ...data,
          date: new Date().toLocaleString(),
        });
        localStorage.setItem("history", JSON.stringify(history));
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 p-6 bg-slate-300 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 text-center">
          Subir imagen para reconocimiento
        </h2>

        {/* Checkbox invertir */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="invert"
            checked={invert}
            onChange={() => setInvert(!invert)}
          />
          <label htmlFor="invert" className="form-label">
            Invertir imagen
          </label>
        </div>

        {/* Input imagen */}
        <div>
          <label htmlFor="image" className="form-label">
            Selecciona una imagen (28x28 px)
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full p-2 text-sm border border-slate-300 rounded-lg cursor-pointer bg-slate-100"
          />
          {image && (
            <p className="mt-2 text-sm text-slate-700">
              Archivo seleccionado: {image.name}
            </p>
          )}
        </div>

        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Vista previa"
              className="max-h-40 border border-slate-900 shadow-sm"
            />
          </div>
        )}

        {error && (
          <p className="text-red-600 text-center font-semibold">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="block w-full py-2 px-4 rounded-lg text-white font-medium shadow-md bg-blue-800"
        >
          {loading ? "Subiendo Imagen..." : "Enviar"}
        </button>
      </form>

      {imageResponse && (
        <div className="max-w-md mx-auto mt-10 p-6 bg-slate-300 rounded-2xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 text-center">
            Resultado del reconocimiento
          </h2>
          <p className="text-xl">Predicción: {imageResponse.prediction}</p>
          <p className="text-xl">
            Precisión:{" "}
            <span
              className={`${
                imageResponse.accuracy > 50 ? "text-green-700" : "text-red-700"
              }`}
            >
              {imageResponse.accuracy}%
            </span>
          </p>
          <p className="text-lg">
            Tiempo de procesamiento: {imageResponse.process_time}
          </p>
        </div>
      )}
    </>
  );
}
export { ImageForm };
