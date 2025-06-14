import React from "react";
import Icon from "./Icon";

function formatarDataHorario(horario) {
  if (!horario) return "";
  const [data, hora] = horario.split(/[ T]/);
  if (!data || !hora) return horario;
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano} ${hora}`;
}

export default function EstatisticasCard({ slots, children }) {
  const total = slots.filter(s => s.nome).length;
  const proximos = slots
    .filter(s => s.nome && s.horario)
    .map(s => s.horario)
    .sort();

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 w-full max-w-lg shadow-md flex flex-col relative transition-all duration-150 ease-out">
      <div className="flex items-center justify-between mb-4">
        <div className="rounded-full p-4 bg-green-50 text-green-500 flex items-center justify-center shadow">
          <Icon name="bar_chart" className="text-3xl sm:text-4xl" />
        </div>
      </div>
      <div className="mb-2">
        <div className="font-extrabold text-2xl md:text-3xl text-blue-800">
          Estatísticas
        </div>
        <div className="text-gray-500 text-base">
          Resumo dos medicamentos cadastrados
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="text-lg">
          <span className="font-bold text-blue-700">{total}</span>{" "}
          <span className="text-gray-700">medicamentos cadastrados</span>
        </div>
        <div className="text-base text-gray-700">
          {proximos.length > 0 ? (
            <>
              <span className="font-semibold text-blue-700">Próximos horários:</span>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                {proximos.map((h, i) => (
                  <li key={i} className="text-base">
                    <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                      {formatarDataHorario(h)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <span className="text-gray-400">Nenhum horário agendado</span>
          )}
        </div>
      </div>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}