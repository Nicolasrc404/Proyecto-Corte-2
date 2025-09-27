import "./index.css";
import { useState } from "react";
import type { ImageRecognitionResponse } from "../../models/Image";
import Swal from "sweetalert2";
import { Link } from "react-router";

function ImageForm() {
  const [invert, setinvert] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageResponse, setImageResponse] =
    useState<ImageRecognitionResponse | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);

      const objectUrl = URL.createObjectURL(selectedImage);
      setPreview(objectUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!image) {
      Swal.fire({
        title: "¡Error!",
        text: "Debes subir una imagen para el reconocimiento",
        icon: "error",
        confirmButtonText: "De acuerdo",
      });
      setLoading(false);
      return;
    }

    Swal.fire({
      title: "Confirmar operacion",
      text: "¿Desea reconocer esta imagen?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const fromData = new FormData();
        fromData.append("invert", invert ? "true" : "false");
        fromData.append("image", image!);

        fetch("http://ec2-54-81-142-28.compute-1.amazonaws.com:8080/predict", {
          method: "POST",
          body: fromData,
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
            setImageResponse(imageResponse);
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
      }
      setLoading(false);
    });
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
        <div>
          <label htmlFor="invert" className="form-label">
            Invertir imagen (marca si el dígito está en blanco sobre fondo
            negro)
          </label>
          <input
            type="checkbox"
            name="invert"
            id="invert"
            onChange={() => {
              setinvert(!invert);
            }}
          />
          <label htmlFor="image" className="form-label">
            Selecciona una imagen
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleImageChange}
            className="block w-full p-2 text-sm text-slate-300 border border-slate-300 rounded-lg cursor-pointer bg-slate-500"
          />
          {image && (
            <p className="mt-2 text-sm text-slate-500">
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
        <button
          type="submit"
          disabled={loading}
          className="block w-full py-2 px-4 rounded-lg text-slate-300  font-medium shadow-md  bg-blue-800"
        >
          {loading ? "Subiendo Imagen..." : "Enviar"}
        </button>
      </form>
      {imageResponse && (
        <div className="max-w-md mx-auto mt-10 p-6 bg-slate-300 rounded-2xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 text-center">
            Resultado del reconocimiento
          </h2>
          <p className="text-xl">Prediccion: {imageResponse.prediction}</p>
          <p className="text-xl">
            Precision:{" "}
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
