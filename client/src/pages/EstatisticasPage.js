import React, { useState, useEffect } from "react";
import EstatisticasCard from "../components/EstatisticasCard";

function getMedicamentoMaisFrequente(slots) {
  const nomes = slots.filter((s) => s && s.nome).map((s) => s.nome);
  if (nomes.length === 0) return "Nenhum";
  const freq = {};
  nomes.forEach((nome) => {
    freq[nome] = (freq[nome] || 0) + 1;
  });
  const maisFrequente = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  return maisFrequente[0];
}

function getHistoricoCompleto() {
  const salvo = localStorage.getItem("historico_medicamentos");
  return salvo ? JSON.parse(salvo) : [];
}

function formatarDataHorario(horario) {
  if (!horario) return "";
  const [data, hora] = horario.split(/[ T]/);
  if (!data || !hora) return horario;
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano} ${hora}`;
}

export default function EstatisticasPage({ slots, fetchSlots }) {
  // Carrega o estado de "limpou histórico" do localStorage
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [limpouHistorico, setLimpouHistorico] = useState(
    localStorage.getItem("limpou_historico") === "true"
  );
  const [historico, setHistorico] = useState(getHistoricoCompleto());

  useEffect(() => {
    // Só salva no localStorage se não tiver limpado o histórico
    if (!limpouHistorico && slots && slots.length > 0) {
      // Filtra apenas medicamentos válidos
      const medicamentosValidos = slots.filter((s) => s && s.nome);
      localStorage.setItem("historico_medicamentos", JSON.stringify(medicamentosValidos));
      setHistorico(medicamentosValidos);
    }
    // Se limpou, garante que o histórico local fique vazio
    if (limpouHistorico) {
      setHistorico([]);
    }
  }, [slots, limpouHistorico]);

  async function handleLimparHistorico() {
    // Limpa no backend
    await fetch("http://localhost:5000/medicamentos", { method: "DELETE" });
    // Limpa no localStorage
    localStorage.removeItem("historico_medicamentos");
    localStorage.setItem("limpou_historico", "true");
    setHistorico([]);
    setLimpouHistorico(true);
    if (typeof fetchSlots === "function") fetchSlots();
  }

  // Se cadastrar um novo medicamento, reseta o estado de "limpou histórico"
  useEffect(() => {
    if (limpouHistorico && slots && slots.length > 0) {
      localStorage.setItem("limpou_historico", "false");
      setLimpouHistorico(false);
    }
  }, [slots]);

  const total = slots.filter((s) => s && s.nome).length;
  const recorrentes = slots.filter((s) => s && s.recorrente).length;
  const maisFrequente = getMedicamentoMaisFrequente(slots);

  const historicoExibido = (mostrarTodos ? historico : historico.slice(0, 5)).filter(item => item && item.nome);

  return (
    <div className="w-full flex flex-col justify-center items-center px-2 sm:px-4 md:px-8 py-6">
      <EstatisticasCard slots={slots}>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1 bg-yellow-100 text-yellow-900 rounded-lg px-4 py-6 flex flex-col items-center shadow">
            <span className="text-3xl font-bold">{recorrentes}</span>
            <span className="mt-2 font-semibold">Recorrentes</span>
            <span className="text-xs mt-1">
              {((recorrentes / total) * 100 || 0).toFixed(0)}% do total
            </span>
          </div>
          <div className="flex-1 bg-green-100 text-green-900 rounded-lg px-4 py-6 flex flex-col items-center shadow">
            <span className="text-2xl font-bold">{maisFrequente}</span>
            <span className="mt-2 font-semibold">Mais frequente</span>
          </div>
          <div className="flex-1 bg-blue-50 text-blue-900 rounded-lg px-4 py-6 flex flex-col items-center shadow">
            <span className="text-lg font-bold">
              {slots.length > 0 && slots[slots.length - 1]?.nome
                ? slots[slots.length - 1].nome
                : "Nenhum"}
            </span>
            <span className="mt-2 font-semibold">Último cadastrado</span>
          </div>
        </div>
      </EstatisticasCard>

      {/* Card separado para o histórico completo */}
      <div className="w-full max-w-4xl mt-8">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-md flex flex-col transition-all duration-150 ease-out mx-auto">
          <div className="font-extrabold text-2xl md:text-3xl text-blue-800 mb-2">
            Histórico completo de medicamentos
          </div>
          <div className="text-gray-600 text-base mb-4">
            Aqui você encontra todos os medicamentos já cadastrados no sistema,
            incluindo recorrentes e não recorrentes. Use este histórico para
            acompanhar sua rotina, conferir horários passados e manter seu
            controle sempre atualizado.
          </div>
          {historico.length > 0 ? (
            <>
              <ul className="divide-y divide-blue-50">
                {historicoExibido.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-2 hover:bg-blue-50/60 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg shadow">
                        {item.nome ? item.nome.charAt(0).toUpperCase() : "?"}
                      </span>
                      <span className="font-bold text-blue-800 text-lg">
                        {item.nome || "Sem nome"}
                      </span>
                      {item.recorrente && (
                        <span className="ml-2 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-semibold">
                          recorrente
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <span className="text-gray-500 text-sm">Horário:</span>
                      <span className="bg-blue-50 text-blue-900 px-3 py-1 rounded-lg font-mono font-semibold shadow-sm">
                        {formatarDataHorario(item.horario)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-4">
                {historico.length > 5 && (
                  <button
                    className="text-blue-700 hover:underline font-semibold"
                    onClick={() => setMostrarTodos((v) => !v)}
                  >
                    {mostrarTodos ? "Ver menos" : "Ver todos"}
                  </button>
                )}
                <button
                  className="text-red-600 hover:underline font-semibold ml-auto"
                  onClick={handleLimparHistorico}
                >
                  Limpar histórico
                </button>
              </div>
            </>
          ) : (
            <span className="text-gray-400">Nenhum medicamento registrado</span>
          )}
        </div>
      </div>
    </div>
  );
}