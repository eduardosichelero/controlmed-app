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
    <div className="rounded-2xl border border-blue-100 bg-white p-4 w-full max-w-lg shadow-md flex flex-col relative transition-all duration-150 ease-out hover:scale-102 hover:shadow-lg">
      {/* Slot label e ícone */}
      <div className="flex items-center justify-between mb-3">
        <div
          className={`rounded-full p-3 ${color.icon} flex items-center justify-center`}
          aria-hidden="true"
        >
          <Icon name="pill" className="text-2xl" />
        </div>
        <span className="ml-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold shadow-sm select-none">
          {color.label}
        </span>
      </div>
      {/* Conteúdo */}
      <div className="mb-1">
        <div className="font-bold text-lg md:text-xl text-blue-700" tabIndex={0}>
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