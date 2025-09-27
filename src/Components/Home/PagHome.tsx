import { Link } from "react-router";

function PagHome() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-300 rounded-2xl shadow-lg space-y-6 text-center">
      <h1 className="text-2xl font-bold text-slate-800">
        Bienvenido al reconocimiento de números
      </h1>
      <p className="text-lg text-slate-700">
        Sube una imagen y deja que el modelo la analice automáticamente.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Link
          to="/image"
          className="flex-1 py-2 px-4 rounded-lg text-slate-300 font-medium shadow-md bg-blue-800 hover:bg-blue-900 transition text-center"
        >
          Ir al reconocimiento
        </Link>
        <Link
          to="/history"
          className="flex-1 py-2 px-4 rounded-lg text-slate-300 font-medium shadow-md bg-blue-800 hover:bg-blue-900 transition text-center"
        >
          Ir al historial
        </Link>
      </div>
    </div>
  );
}

export { PagHome };
