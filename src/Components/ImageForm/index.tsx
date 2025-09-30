import type React from "react";
import "./index.css";
import { useState } from "react";
import type { ImageRecognitionResponse } from "../../models/Image";
import Swal from "sweetalert2";
import { Link } from "react-router";

function ImageForm() {
  const [invert, setInvert] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageResponse, setImageResponse] =
    useState<ImageRecognitionResponse | null>(null);

  // Manejar selección de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      const objectUrl = URL.createObjectURL(selectedImage);

      // Validar que la imagen sea 28x28
      const img = new Image();
      img.src = objectUrl;

      img.onload = () => {
        if (img.width !== 28 || img.height !== 28) {
          Swal.fire({
            title: "Error",
            text: "La imagen debe tener un tamaño de 28x28 píxeles.",
            icon: "error",
            confirmButtonText: "De acuerdo",
          });
          // Reiniciar estados si no es válida
          setImage(null);
          setPreview(null);
          return;
        }

        // Si la imagen es válida, la guardamos
        setImage(selectedImage);
        setPreview(objectUrl);
      };
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que haya imagen seleccionada
    if (!image) {
      Swal.fire({
        title: "¡Error!",
        text: "Debes subir una imagen de 28x28 píxeles antes de enviar.",
        icon: "error",
        confirmButtonText: "De acuerdo",
      });
      return;
    }

    setLoading(true);

    // Confirmación antes de enviar
    Swal.fire({
      title: "Confirmar operación",
      text: "¿Desea reconocer esta imagen?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("invert", invert ? "true" : "false");
        formData.append("image", image);

        // Enviar al servidor
        fetch("http://ec2-54-81-142-28.compute-1.amazonaws.com:8080/predict", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              Swal.fire({
                title: "Error en el servidor",
                text: `Código de error: ${response.status}`,
                icon: "error",
                confirmButtonText: "De acuerdo",
              });
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json() as Promise<ImageRecognitionResponse>;
          })
          .then((imageResponse) => {
            // Guardar la respuesta en estado
            setImageResponse(imageResponse);

            // Guardar en localStorage para el historial
            const logs = JSON.parse(localStorage.getItem("logs") || "[]");
            const newLog = {
              prediction: imageResponse.prediction,
              accuracy: imageResponse.accuracy,
              process_time: imageResponse.process_time,
              fecha: new Date().toLocaleString(),
            };
            logs.push(newLog);
            localStorage.setItem("logs", JSON.stringify(logs));
          })
          .catch((error) => {
            Swal.fire({
              title: "Error de conexión",
              text: `No se pudo completar la petición: ${error}`,
              icon: "error",
              confirmButtonText: "De acuerdo",
            });
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  };

  return (
    <>
      {/* Formulario principal */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 p-6 bg-gray-300 border border-gray-400 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 text-center">
          Subir imagen para reconocimiento
        </h2>

        <div>
          {/* Opción de invertir */}
          <label htmlFor="invert" className="form-label block">
            Invertir imagen (marca si el dígito está en blanco sobre fondo
            negro)
          </label>
          <input
            type="checkbox"
            name="invert"
            id="invert"
            onChange={() => setInvert(!invert)}
          />

          {/* Selección de archivo */}
          <label htmlFor="image" className="form-label mt-4 block">
            Selecciona una imagen de 28x28 píxeles
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleImageChange}
            className="block w-full p-2 text-sm text-slate-300 border border-gray-700 rounded-lg cursor-pointer bg-slate-500"
          />
          {image && (
            <p className="mt-2 text-sm text-slate-500">
              Archivo seleccionado: {image.name}
            </p>
          )}
        </div>

        {/* Vista previa */}
        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Vista previa"
              className="max-h-40 border border-slate-900 shadow-sm"
            />
          </div>
        )}

        {/* Botón enviar */}
        <button
          type="submit"
          disabled={loading}
          className="block w-full py-2 px-4 rounded-lg text-slate-300  font-medium shadow-md  bg-gray-600 hover:bg-gray-900 border border-slate-700"
        >
          {loading ? "Subiendo Imagen..." : "Enviar"}
        </button>
      </form>

      {/* Resultado */}
      {imageResponse && (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-300 border border-gray-400 rounded-2xl shadow-lg space-y-6">
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

      {/* Link al historial */}
      <div className="text-center mt-6">
        <Link
          to="/history"
          className="text-blue-800 hover:underline font-medium"
        >
          Ver historial
        </Link>
      </div>
    </>
  );
}

export { ImageForm };
