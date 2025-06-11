import React from "react";

export default function ArduinoStatus({ status }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span
        className={`inline-block w-3 h-3 rounded-full ${
          status === "conectado" ? "bg-green-500" : "bg-red-500"
        }`}
        title={`Arduino ${status}`}
      ></span>
      <span className="text-sm text-gray-600">
        Arduino: {status === "conectado" ? "Conectado" : "Desconectado"}
      </span>
    </div>
  );
}