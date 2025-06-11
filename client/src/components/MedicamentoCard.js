import React from "react";
import Icon from "./Icon";
import { useNavigate } from "react-router-dom";

function formatarDataHorario(horario) {
  if (!horario) return "";
  // Espera formato: "YYYY-MM-DD HH:mm" ou "YYYY-MM-DDTHH:mm"
  const [data, hora] = horario.split(/[ T]/);
  if (!data || !hora) return horario;
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano} ${hora}`;
}

export default function MedicamentoCard({ slot, onRemove }) {
  const navigate = useNavigate();
  const iconColor = "text-blue-500 bg-blue-50";

  function handleClick() {
    if (!slot.nome) {
      navigate("/cadastrar");
    } else {
      onRemove();
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 w-full max-w-lg shadow-sm flex flex-col relative">
      {/* Ícone */}
      <div className="flex items-center justify-between mb-3">
        <div
          className={`rounded-full p-3 ${iconColor} flex items-center justify-center`}
          aria-hidden="true"
        >
          <Icon name="medication" className="text-2xl" />
        </div>
      </div>
      {/* Conteúdo */}
      <div className="mb-1">
        <div className="font-semibold text-lg md:text-xl text-gray-900" tabIndex={0}>
          {slot.nome || <span className="text-gray-400">Vazio</span>}
        </div>
        <div className="text-gray-700 text-base md:text-lg" tabIndex={0}>
          {slot.horario ? (
            <span>
              <span className="font-semibold">Horário:&nbsp;</span>
              {formatarDataHorario(slot.horario)}
            </span>
          ) : (
            <span className="text-gray-400">Sem horário definido</span>
          )}
        </div>
        {/* Indicador de recorrência */}
        {slot.recorrente && (
          <div className="mt-1 flex items-center gap-1 text-blue-600 text-sm font-semibold" aria-label="Medicamento recorrente">
            <Icon name="autorenew" className="text-base" />
            Recorrente
          </div>
        )}
      </div>
      {/* Botão */}
      <button
        className={`mt-3 w-full font-semibold py-2 rounded-xl transition text-base
          ${slot.nome
            ? "bg-red-100 hover:bg-red-200 text-red-700"
            : "bg-gray-100 hover:bg-gray-200 text-gray-900"
          }`}
        onClick={handleClick}
        aria-label={slot.nome ? `Remover medicamento ${slot.nome}` : "Adicionar medicamento"}
        disabled={!!slot.nome && !onRemove}
      >
        {slot.nome ? "Remover" : "Adicionar"}
      </button>
    </div>
  );
}