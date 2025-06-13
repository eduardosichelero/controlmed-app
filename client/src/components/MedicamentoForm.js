import React from "react";
import Icon from "./Icon";

export default function MedicamentoForm({ form, onChange, onSubmit }) {
  // Função para validar se o horário é válido para o dia selecionado
  function horarioValido() {
    if (form.dia === "hoje" && form.horario) {
      const agora = new Date();
      const [h, m] = form.horario.split(":");
      const horarioSelecionado = new Date();
      horarioSelecionado.setHours(Number(h), Number(m), 0, 0);
      return horarioSelecionado > agora;
    }
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!horarioValido()) {
      alert("Não é permitido cadastrar um medicamento para um horário que já passou hoje.");
      return;
    }
    onSubmit(e);
  }

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-4 w-full max-w-lg shadow-md flex flex-col relative transition-all duration-150 ease-out">
      {/* Ícone e título */}
      <div className="flex items-center justify-between mb-4">
        <div className="rounded-full p-4 bg-blue-50 text-blue-500 flex items-center justify-center shadow">
          <Icon name="medication" className="text-3xl" />
        </div>
      </div>
      <div className="mb-2">
        <h1 className="font-semibold text-2xl text-blue-800" tabIndex={0}>
          Cadastrar Medicamento
        </h1>
        <p className="text-gray-500 text-base" tabIndex={0}>
          Preencha os dados para agendar a liberação
        </p>
      </div>
      <form autoComplete="off" className="space-y-4 mt-2" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="slot" className="block font-medium mb-1 text-base">
            Slot:
          </label>
          <select
            name="slot"
            id="slot"
            required
            className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 bg-gray-50 text-lg outline-none transition"
            value={form.slot}
            onChange={onChange}
            aria-label="Selecione o slot do medicamento"
          >
            <option value="">Selecione o slot</option>
            <option value="1">Slot 1</option>
            <option value="2">Slot 2</option>
            <option value="3">Slot 3</option>
          </select>
        </div>
        <div>
          <label htmlFor="nome" className="block font-medium mb-1 text-base">
            Nome do medicamento:
          </label>
          <input
            type="text"
            name="nome"
            id="nome"
            placeholder="Ex: Paracetamol"
            required
            className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 bg-gray-50 text-lg outline-none transition"
            value={form.nome}
            onChange={onChange}
            aria-label="Nome do medicamento"
          />
        </div>
        <div>
          <label htmlFor="horario" className="block font-medium mb-1 text-base">
            Horário:
          </label>
          <input
            type="time"
            name="horario"
            id="horario"
            required
            className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 bg-gray-50 text-lg outline-none transition"
            value={form.horario}
            onChange={onChange}
            aria-label="Horário do medicamento"
          />
        </div>
        <div>
          <label htmlFor="dia" className="block font-medium mb-1 text-base">
            Dia:
          </label>
          <select
            name="dia"
            id="dia"
            required
            className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 bg-gray-50 text-lg outline-none transition"
            value={form.dia}
            onChange={onChange}
            aria-label="Selecione o dia"
          >
            <option value="">Selecione</option>
            <option value="hoje">Hoje</option>
            <option value="amanha">Amanhã</option>
            <option value="data">Escolher data</option>
          </select>
          {form.dia === "data" && (
            <input
              type="date"
              name="data_escolhida"
              id="data_escolhida"
              className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 mt-2 bg-gray-50 text-lg outline-none transition"
              value={form.data_escolhida}
              onChange={onChange}
              aria-label="Escolha a data"
            />
          )}
        </div>
        {/* Campo para marcar como recorrente */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="recorrente"
            name="recorrente"
            checked={!!form.recorrente}
            onChange={onChange}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            aria-checked={!!form.recorrente}
          />
          <label
            htmlFor="recorrente"
            className="text-base text-gray-700 select-none cursor-pointer"
          >
            Marcar como recorrente
          </label>
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-150 ease-out flex items-center justify-center gap-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Cadastrar medicamento"
        >
          <Icon name="add_circle" /> Cadastrar
        </button>
      </form>
    </div>
  );
}