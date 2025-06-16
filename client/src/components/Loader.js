import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div className="flex flex-col items-center gap-2 p-6 rounded-xl shadow bg-white border border-blue-100">
        <span className="material-icons animate-spin text-4xl text-violet-600">
          autorenew
        </span>
        <span className="text-base font-medium text-blue-700">Carregando...</span>
      </div>
    </div>
  );
}