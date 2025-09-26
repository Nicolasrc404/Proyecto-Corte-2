import { useEffect, useState } from "react";
import { Link } from "react-router";

interface LogEntry {
  prediction: number;
  accuracy: number;
  process_time: string;
  fecha: string;
}

function History() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem("logs") || "[]");
    setLogs(savedLogs);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-slate-200 rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 text-center">
        Historial de predicciones
      </h2>

      {logs.length === 0 ? (
        <p className="text-center text-slate-700">
          No hay registros en el historial.
        </p>
      ) : (
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-xl shadow-md border border-slate-300"
            >
              <p className="text-slate-700">
                <span className="font-semibold">Fecha:</span> {log.fecha}
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Predicción:</span>{" "}
                {log.prediction}
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Precisión:</span>{" "}
                <span
                  className={`font-bold ${
                    log.accuracy > 50 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {log.accuracy}%
                </span>
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Tiempo:</span>{" "}
                {log.process_time}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <Link to="/image" className="text-blue-800 hover:underline font-medium">
          Ir al reconocimiento de números
        </Link>
      </div>
    </div>
  );
}

export { History };
