import React from "react";
import Icon from "./Icon";
import { useNavigate } from "react-router-dom";

function formatarDataHorario(horario) {
  if (!horario) return "";
  const [data, hora] = horario.split(/[ T]/);
  if (!data || !hora) return horario;
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano} ${hora}`;
}

// Defina cores e rótulos para cada slot
const slotColors = [
  { icon: "text-blue-600 bg-blue-100", label: "Slot 1" },
  { icon: "text-green-600 bg-green-100", label: "Slot 2" },
  { icon: "text-yellow-600 bg-yellow-100", label: "Slot 3" },
];

export default function MedicamentoCard({ slot, onRemove, slotIndex = 0 }) {
  const navigate = useNavigate();
  const color = slotColors[slotIndex % slotColors.length];

  function handleClick() {
    if (!slot.nome) {
      navigate("/cadastrar");
    } else {
      onRemove();
    }
  }

  return (
    <div className="relative rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 w-full min-w-[180px] max-w-full shadow-xl flex flex-col transition-all duration-150 ease-out mx-auto overflow-hidden">
      <div className="absolute right-6 top-6 opacity-10 text-7xl pointer-events-none select-none">
        <Icon name="pill" className="text-blue-300 text-7xl" />
      </div>
      {/* Slot label e ícone */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div
          className={`rounded-full p-3 ${color.icon} flex items-center justify-center shadow`}
          aria-hidden="true"
        >
          <Icon name="pill" className="text-2xl" />
        </div>
        <span
          className={`ml-2 px-3 py-1 rounded-full text-xs font-bold shadow-sm select-none break-all
            ${slot.nome
              ? "bg-red-100 text-red-700 animate-pulse-slow"
              : "bg-gray-100 text-gray-700"
            }`
          }
        >
          {color.label}
        </span>
      </div>
      {/* Conteúdo */}
      <div className="mb-1">
        <div className="font-bold text-lg md:text-xl text-blue-700 break-words" tabIndex={0}>
          {slot.nome || <span className="text-gray-400">Vazio</span>}
        </div>
        <div className="text-gray-700 text-base md:text-lg break-words" tabIndex={0}>
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
        className={`mt-4 w-full font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition text-base
          ${slot.nome
            ? "bg-red-100 hover:bg-red-200 text-red-700"
            : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        onClick={handleClick}
        aria-label={slot.nome ? `Remover medicamento ${slot.nome}` : "Adicionar medicamento"}
        disabled={!!slot.nome && !onRemove}
        type="button"
      >
        {slot.nome ? (
          <>
            <Icon name="delete" className="text-lg" />
            Remover
          </>
        ) : (
          <>
            <Icon name="add" className="text-lg" />
            Adicionar
          </>
        )}
      </button>
    </div>
  );
}