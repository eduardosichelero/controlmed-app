import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center gap-2 text-blue-600 mb-4">
      <span className="material-icons animate-spin">autorenew</span>
      Carregando...
    </div>
  );
}