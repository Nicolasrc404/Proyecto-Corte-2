import { useEffect, useState } from "react";
import type { ImageRecognitionResponse } from "../../models/Image";

interface HistoryItem extends ImageRecognitionResponse {
  date: string;
}

function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(data);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-slate-200 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 text-center mb-4">
        Historial de predicciones
      </h2>
      {history.length === 0 ? (
        <p className="text-center">No hay registros en el historial.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((item, index) => (
            <li
              key={index}
              className="p-4 bg-white rounded-lg shadow border border-slate-300"
            >
              <p>
                <strong>Fecha:</strong> {item.date}
              </p>
              <p>
                <strong>Predicción:</strong> {item.prediction}
              </p>
              <p>
                <strong>Precisión:</strong>{" "}
                <span
                  className={`${
                    item.accuracy > 50 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {item.accuracy}%
                </span>
              </p>
              <p>
                <strong>Tiempo:</strong> {item.process_time}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { History };
