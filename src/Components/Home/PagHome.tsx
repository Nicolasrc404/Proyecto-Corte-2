import { Link } from "react-router";

function PagHome() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-300 border border-gray-400 rounded-2xl shadow-lg space-y-6 text-center">
      <h1 className="text-2xl font-bold text-slate-800">
        Bienvenido al reconocimiento de números
      </h1>
      <p className="text-lg text-slate-700">
        Sube una imagen y deja que el modelo la analice automáticamente.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Link
          to="/image"
          className="flex-1 py-2 px-4 rounded-lg text-slate-300 font-medium shadow-md bg-gray-600 hover:bg-gray-900 border border-slate-700 transition text-center"
        >
          Ir al reconocimiento
        </Link>
        <Link
          to="/history"
          className="flex-1 py-2 px-4 rounded-lg text-slate-300 font-medium shadow-md bg-gray-600 hover:bg-gray-900 border border-slate-700  transition text-center"
        >
          Ir al historial
        </Link>
      </div>
    </div>
  );
}

export { PagHome };
