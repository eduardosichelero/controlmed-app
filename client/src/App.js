// client/src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import BannerProximoMedicamento from "./components/BannerProximoMedicamento";
import Loader from "./components/Loader";
import DashboardPage from "./pages/DashboardPage";
import MedicamentosPage from "./pages/MedicamentosPage";
import CadastrarPage from "./pages/CadastrarPage";
import EstatisticasPage from "./pages/EstatisticasPage";
import MedicamentosComunsPage from "./pages/MedicamentosComunsPage";

export default function ControleMedicamentos() {
  // Estado para armazenar os slots de medicamentos, carregados do servidor
  const [slots, setSlots] = useState([]);
  // Estado para o formulário de cadastro de novo medicamento
  const [form, setForm] = useState({
    slot: "",
    nome: "",
    horario: "",
    dia: "",
    data_escolhida: "",
    recorrente: false, // <-- adicione esta linha
  });
  // Estado para mensagens de feedback ao usuário
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lembrete, setLembrete] = useState(null);

  // Efeito para carregar os slots de medicamentos do servidor ao montar o componente
  useEffect(() => {
    fetchSlots();
  }, []); // Executa apenas uma vez ao carregar o componente

  // Função para buscar os slots de medicamentos do servidor
  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/medicamentos");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      // Garante que haja pelo menos 3 slots, preenchendo com vazios se necessário
      const paddedData = [...data];
      while (paddedData.length < 3) {
        paddedData.push({ nome: "", horario: "", dia: "", data_escolhida: "" });
      }
      setSlots(paddedData.slice(0, 3));
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error);
      setMessage("Erro ao carregar medicamentos. Tente novamente.");
    }
    setLoading(false);
  };

  // Lida com a mudança nos campos do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Limpa a data escolhida se o dia não for "data"
    if (name === "dia" && value !== "data") {
      setForm((prev) => ({
        ...prev,
        data_escolhida: "",
      }));
    }
  };

  // Lida com o envio do formulário para cadastrar/atualizar medicamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.slot) {
      setMessage("Por favor, selecione um slot.");
      return;
    }

    // Verifica se o slot já está ocupado
    const slotIndex = parseInt(form.slot, 10) - 1;
    const slotOcupado = slots[slotIndex] && slots[slotIndex].nome;

    if (slotOcupado) {
      const confirmar = window.confirm(
        "Este slot já possui um medicamento cadastrado. Você deseja substituir o medicamento?"
      );
      if (!confirmar) {
        setMessage("Cadastro cancelado.");
        return;
      }
      // Remove o medicamento antigo antes de cadastrar o novo
      await fetch(`http://localhost:5000/medicamentos/${form.slot}`, {
        method: "DELETE",
      });
    }

    // Monta a data completa
    let dataCompleta = "";
    const hoje = new Date();
    if (form.dia === "hoje") {
      dataCompleta = `${hoje.toISOString().slice(0, 10)} ${form.horario}`;
    } else if (form.dia === "amanha") {
      const amanha = new Date(hoje);
      amanha.setDate(hoje.getDate() + 1);
      dataCompleta = `${amanha.toISOString().slice(0, 10)} ${form.horario}`;
    } else if (form.dia === "data" && form.data_escolhida) {
      dataCompleta = `${form.data_escolhida} ${form.horario}`;
    } else {
      setMessage("Por favor, selecione o dia corretamente.");
      return;
    }

    console.log(form); // Adicione antes do fetch POST

    try {
      const response = await fetch("http://localhost:5000/medicamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot: form.slot,
          nome: form.nome,
          horario: dataCompleta,
          recorrente: form.recorrente, // ESSENCIAL!
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchSlots();
      setMessage("Medicamento cadastrado/atualizado com sucesso!");
      setForm({
        slot: "",
        nome: "",
        horario: "",
        dia: "",
        data_escolhida: "",
        recorrente: false, // reseta o campo recorrente
      });
    } catch (error) {
      console.error("Erro ao cadastrar medicamento:", error);
      setMessage("Erro ao cadastrar medicamento. Tente novamente.");
    }
  };

  const removerMedicamento = async (slotIdx) => {
    if (!window.confirm("Tem certeza que deseja remover este medicamento?")) return;
    try {
      const response = await fetch(`http://localhost:5000/medicamentos/${slotIdx + 1}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao remover medicamento");
      await fetchSlots();
      setMessage("Medicamento removido com sucesso!");
    } catch (error) {
      setMessage("Erro ao remover medicamento.");
    }
  };

  // Checa a cada minuto se existe medicamento para o horário atual
  useEffect(() => {
    const interval = setInterval(() => {
      const agora = new Date();
      const agoraStr = agora.toISOString().slice(0, 16).replace("T", " ");
      // Tolerância de 1 minuto para o lembrete
      const proximo = slots.find(slot => {
        if (!slot.horario) return false;
        // slot.horario no formato "YYYY-MM-DD HH:mm"
        return slot.horario.slice(0, 16) === agoraStr.slice(0, 16);
      });
      if (proximo && proximo.nome) {
        setLembrete(proximo);
      } else {
        setLembrete(null);
      }
    }, 1000 * 10); // checa a cada 10 segundos

    return () => clearInterval(interval);
  }, [slots]);

  return (
    <Router>
      <div className="h-screen bg-gray-100 font-['Roboto'] flex flex-col md:flex-row">
        {/* Sidebar adaptada: lateral em desktop, topo em mobile */}
        <Sidebar />
        <main className="flex-1 p-0 overflow-y-auto">
          <div className="pt-1 px-2 sm:px-4 md:px-8">
            <BannerProximoMedicamento slots={slots} />
          </div>
          {message && (
            <div
              className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-blue-100 text-blue-700 rounded-lg px-4 sm:px-6 py-3 shadow-lg animate-fade-in flex items-center justify-between gap-4"
              role="alert"
              aria-live="polite"
              style={{ minWidth: 220, maxWidth: 400, textAlign: "center" }}
            >
              <span className="flex-1 text-left">{message}</span>
              <button
                onClick={() => setMessage("")}
                className="ml-4 text-blue-700 hover:text-blue-900 font-bold text-lg focus:outline-none"
                aria-label="Fechar notificação"
                type="button"
              >
                ×
              </button>
            </div>
          )}
          {lembrete && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center border-4 border-blue-500 max-w-md w-full animate-pulse">
                <span className="text-4xl font-bold text-blue-700 mb-4">Hora do medicamento!</span>
                <span className="text-2xl font-semibold text-gray-900 mb-2">{lembrete.nome}</span>
                <span className="text-lg text-gray-700 mb-4">
                  Horário: {lembrete.horario.replace(" ", " às ")}
                </span>
                <button
                  className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg shadow hover:bg-blue-700 transition"
                  onClick={() => setLembrete(null)}
                >
                  Ok, Entendi!
                </button>
              </div>
            </div>
          )}
          <section className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-4 md:pb-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={
                <DashboardPage
                  slots={slots}
                  onRemove={removerMedicamento}
                  form={form}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                />
              } />
              <Route path="/medicamentos" element={
                <MedicamentosPage slots={slots} onRemove={removerMedicamento} />
              } />
              <Route path="/cadastrar" element={
                <CadastrarPage form={form} onChange={handleChange} onSubmit={handleSubmit} />
              } />
              <Route path="/estatisticas" element={
                <EstatisticasPage slots={slots} />
              } />
              <Route path="/medicamentos-comuns" element={<MedicamentosComunsPage />} />
            </Routes>
          </section>
          {loading && <Loader />}
        </main>
      </div>
    </Router>
  );
}
