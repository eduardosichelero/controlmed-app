import React, { useEffect, useState } from "react";
import Icon from "./Icon";

function formatarDataHorario(horario) {
  if (!horario) return "";
  const [data, hora] = horario.split(/[ T]/);
  if (!data || !hora) return horario;
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano} ${hora}`;
}

export default function EstatisticasCard({ slots, children }) {
  const [historico, setHistorico] = useState(() => {
    const salvo = localStorage.getItem("historico_medicamentos");
    return salvo ? JSON.parse(salvo) : [];
  });

  // Atualiza o histórico sempre que slots mudar
  useEffect(() => {
    const medicamentosValidos = slots.filter(s => s && s.nome && s.horario);
    if (medicamentosValidos.length > 0) {
      // Carrega o histórico atual do localStorage para garantir persistência
      const salvo = localStorage.getItem("historico_medicamentos");
      const historicoAtual = salvo ? JSON.parse(salvo) : [];
      let mudou = false;
      medicamentosValidos.forEach((med) => {
        if (!historicoAtual.some(h => h.nome === med.nome && h.horario === med.horario)) {
          historicoAtual.push(med);
          mudou = true;
        }
      });
      if (mudou) {
        setHistorico(historicoAtual);
        localStorage.setItem("historico_medicamentos", JSON.stringify(historicoAtual));
      } else {
        setHistorico(historicoAtual);
      }
    } else {
      // Se não há medicamentos válidos, apenas recarregue o histórico salvo
      const salvo = localStorage.getItem("historico_medicamentos");
      setHistorico(salvo ? JSON.parse(salvo) : []);
    }
  }, [slots]);

  const total = slots.filter(s => s && s.nome).length;
  const proximos = slots
    .filter(s => s && s.nome && s.horario)
    .map(s => s.horario)
    .sort();

  // Mostra os 3 últimos medicamentos cadastrados do histórico persistente
  const ultimosHistorico = historico.slice(-3).reverse();

  return (
    <div className="relative rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 w-full max-w-6xl min-w-[280px] shadow-xl flex flex-col transition-all duration-150 ease-out mx-auto overflow-hidden">
      <div className="absolute right-8 top-8 opacity-10 text-8xl pointer-events-none select-none">
        <Icon name="bar_chart" className="text-blue-300 text-8xl" />
      </div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="rounded-full p-4 bg-green-50 text-green-500 flex items-center justify-center shadow">
          <Icon name="bar_chart" className="text-3xl sm:text-4xl" />
        </div>
      </div>
      <div className="mb-2">
        <div className="font-extrabold text-2xl md:text-3xl text-blue-800 break-words">
          Estatísticas
        </div>
        <div className="text-gray-500 text-base break-words">
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
                  <li key={i} className="text-base break-words max-w-full">
                    <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded inline-block break-all">
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
        <div className="mt-4">
          <span className="font-semibold text-blue-700">Histórico de medicamentos:</span>
          {ultimosHistorico.length > 0 ? (
            <ul className="list-disc ml-5 mt-1 space-y-1">
              {ultimosHistorico.map((item, idx) => (
                <li key={idx} className="text-base break-words max-w-full">
                  <span className="font-bold text-blue-700">{item.nome || "Sem nome"}</span>{" "}
                  <span className="text-gray-700">em</span>{" "}
                  <span className="bg-blue-50 px-2 py-1 rounded">
                    {formatarDataHorario(item.horario || "")}
                  </span>
                  {item.recorrente && (
                    <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">recorrente</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-400">Nenhum medicamento registrado</span>
          )}
        </div>
      </div>
      {children && (
        <div className="mt-6 flex flex-wrap gap-4 w-full">
          {React.Children.map(children, (child) => (
            <div className="flex-1 min-w-[180px] max-w-full">{child}</div>
          ))}
        </div>
      )}
    </div>
  );
}