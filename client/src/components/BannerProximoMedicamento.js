import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getProximoMedicamento(slots) {
  const agora = new Date();
  let proximo = null;
  let menorDiferenca = Infinity;

  slots.forEach((slot) => {
    if (slot && slot.nome && slot.horario) {
      const horario = new Date(slot.horario.replace(" ", "T"));
      const diff = horario - agora;
      if (diff > 0 && diff < menorDiferenca) {
        menorDiferenca = diff;
        proximo = { ...slot, diff, horarioObj: horario };
      }
    }
  });

  return proximo;
}

function formatCountdown(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatDataHorario(horarioObj) {
  if (!horarioObj) return "";
  const hoje = new Date();
  const isHoje =
    horarioObj.getDate() === hoje.getDate() &&
    horarioObj.getMonth() === hoje.getMonth() &&
    horarioObj.getFullYear() === hoje.getFullYear();

  const dia = String(horarioObj.getDate()).padStart(2, "0");
  const mes = String(horarioObj.getMonth() + 1).padStart(2, "0");
  const ano = horarioObj.getFullYear();
  const horas = String(horarioObj.getHours()).padStart(2, "0");
  const minutos = String(horarioObj.getMinutes()).padStart(2, "0");

  return {
    texto: `${dia}/${mes}/${ano} ${horas}:${minutos}`,
    isHoje,
  };
}

export default function BannerProximoMedicamento({ slots }) {
  const [countdown, setCountdown] = useState("");
  const [proximo, setProximo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    function update() {
      const prox = getProximoMedicamento(slots);
      setProximo(prox);
      setCountdown(prox ? formatCountdown(prox.diff) : "--:--:--");
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [slots]);

  let dataFormatada = null;
  if (proximo && proximo.horarioObj) {
    dataFormatada = formatDataHorario(proximo.horarioObj);
  }

  return (
    <div className="rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-10 flex flex-col hd:flex-row items-start hd:items-center justify-between bg-gradient-to-r from-violet-700 via-blue-600 to-blue-400 relative overflow-hidden shadow-xl border-2 border-violet-200">
      {/* Badge Premium - agora com espaçamento */}
      <span className="bg-white/20 text-white text-xs px-5 py-2 rounded-full font-semibold shadow-sm z-10 mb-4 sm:mb-8 hd:mb-0 mr-0 hd:mr-8 self-start tracking-wide backdrop-blur">
        Próxima dose
      </span>
      {/* Conteúdo principal e cronômetro lado a lado */}
      <div className="z-10 flex-1 min-w-0 flex flex-col hd:flex-row hd:items-center hd:gap-12 w-full">
        {/* Texto principal */}
        <div className="flex-1 w-full">
          <h2 className="text-2xl sm:text-3xl hd:text-4xl font-extrabold text-white mb-2 break-words drop-shadow-lg">
            {proximo
              ? `Próximo medicamento: ${proximo.nome}`
              : "Nenhum medicamento agendado"}
          </h2>
          <p className="text-white/90 mb-4 break-words flex items-center gap-3 flex-wrap text-lg">
            {proximo && dataFormatada ? (
              <>
                Horário:{" "}
                {dataFormatada.isHoje && (
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mr-2 shadow">
                    HOJE
                  </span>
                )}
                <span className={dataFormatada.isHoje ? "font-bold text-white" : ""}>
                  {dataFormatada.texto}
                </span>
              </>
            ) : (
              "Cadastre um medicamento para ver o cronômetro."
            )}
          </p>
          <button
            className="border border-white text-white font-semibold px-6 sm:px-8 py-3 rounded-xl hover:bg-white/10 transition text-base shadow-lg mt-2"
            onClick={() => navigate("/medicamentos")}
          >
            Ver todos
          </button>
        </div>
        {/* Cronômetro destacado */}
        <div className="flex justify-center items-center mt-4 sm:mt-6 hd:mt-0 w-full hd:w-auto">
          <div
            className="bg-white/90 text-violet-700 font-extrabold px-8 sm:px-12 py-4 sm:py-5 rounded-3xl shadow-2xl text-3xl sm:text-4xl hd:text-5xl tracking-widest border-4 border-violet-300 focus:outline-none transition-all duration-200"
            style={{
              letterSpacing: "0.18em",
              minWidth: "120px",
              textAlign: "center",
              transform: "none",
            }}
            aria-label="Tempo restante para o próximo medicamento"
          >
            {countdown}
          </div>
        </div>
      </div>
      {/* Círculos decorativos - escondidos em telas menores que hd */}
      <div className="hidden hd:block absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 rounded-full bg-white/10"></div>
          <div className="absolute inset-8 rounded-full bg-white/10"></div>
          <div className="absolute inset-16 rounded-full bg-white/10"></div>
          <div className="absolute inset-24 rounded-full bg-white/10"></div>
        </div>
      </div>
    </div>
  );
}