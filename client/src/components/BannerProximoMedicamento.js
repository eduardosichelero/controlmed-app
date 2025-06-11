import React, { useEffect, useState } from "react";

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
    <div className="rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-violet-600 to-blue-500 relative overflow-hidden">
      {/* Badge Premium - agora com espaçamento */}
      <span className="bg-violet-400 text-white text-xs px-4 py-1 rounded-full font-semibold shadow-sm z-10 mb-4 sm:mb-6 md:mb-0 mr-0 md:mr-6 self-start">
        Próxima dose
      </span>
      {/* Conteúdo principal e cronômetro lado a lado */}
      <div className="z-10 flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:gap-8 w-full">
        {/* Texto principal */}
        <div className="flex-1 w-full">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2 break-words">
            {proximo
              ? `Próximo medicamento: ${proximo.nome}`
              : "Nenhum medicamento agendado"}
          </h2>
          <p className="text-white/80 mb-4 sm:mb-6 break-words flex items-center gap-3 flex-wrap">
            {proximo && dataFormatada ? (
              <>
                Horário:{" "}
                {dataFormatada.isHoje && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
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
          <button className="border border-white text-white font-semibold px-4 sm:px-6 py-2 rounded-lg hover:bg-white/10 transition text-sm sm:text-base">
            Ver todos
          </button>
        </div>
        {/* Cronômetro destacado */}
        <div className="flex justify-center items-center mt-4 sm:mt-6 md:mt-0 w-full md:w-auto">
          <div
            className="bg-white text-violet-700 font-extrabold px-6 sm:px-10 py-3 sm:py-4 rounded-2xl shadow-lg text-2xl sm:text-3xl md:text-5xl tracking-widest border-4 border-violet-200 focus:outline-none"
            style={{
              letterSpacing: "0.15em",
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
      {/* Círculos decorativos - escondidos em telas pequenas */}
      <div className="hidden sm:block absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 rounded-full bg-white/10"></div>
          <div className="absolute inset-6 rounded-full bg-white/10"></div>
          <div className="absolute inset-12 rounded-full bg-white/10"></div>
          <div className="absolute inset-20 rounded-full bg-white/10"></div>
        </div>
      </div>
    </div>
  );
}