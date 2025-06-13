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
    <div className="rounded-2xl border border-gray-200 bg-white p-4 w-full max-w-lg shadow-sm flex flex-col relative">
      <div className="flex items-center justify-between mb-4">
        <div className="rounded-full p-3 sm:p-4 bg-green-50 text-green-500 flex items-center justify-center">
          <Icon name="bar_chart" className="text-3xl sm:text-4xl" />
        </div>
      </div>
      <div className="mb-2">
        <div className="font-extrabold text-xl sm:text-2xl md:text-3xl text-gray-900">
          Estatísticas
        </div>
        <div className="text-gray-500 text-base sm:text-lg">
          Resumo dos medicamentos cadastrados
        </div>
      </div>
      <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
        <div className="text-lg sm:text-xl">
          <span className="font-bold">{total}</span> medicamentos cadastrados
        </div>
        <div className="text-base text-gray-700">
          {proximos.length > 0
            ? (
              <>
                <span className="font-semibold">Próximos horários:</span>
                <ul className="list-disc ml-4 sm:ml-6 mt-1">
                  {proximos.map((h, i) => (
                    <li key={i} className="text-base sm:text-lg">
                      <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                        {formatarDataHorario(h)}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )
            : "Nenhum horário agendado"}
        </div>
      </div>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}