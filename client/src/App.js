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
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    slot: "",
    nome: "",
    horario: "",
    dia: "",
    data_escolhida: "",
    recorrente: false,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lembrete, setLembrete] = useState(null);
  const [alertasEnviados, setAlertasEnviados] = useState({});
  const [alertasDesligados, setAlertasDesligados] = useState({});
  const [alertaDesligadoMsg, setAlertaDesligadoMsg] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/medicamentos");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const paddedData = [...data];
      while (paddedData.length < 3) {
        paddedData.push({ nome: "", horario: "", dia: "", data_escolhida: "" });
      }
      setSlots(paddedData.slice(0, 3));
    } catch (error) {
      setMessage("Erro ao carregar medicamentos. Tente novamente.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "dia" && value !== "data") {
      setForm((prev) => ({
        ...prev,
        data_escolhida: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.slot) {
      setMessage("Por favor, selecione um slot.");
      return;
    }
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
      await fetch(`http://localhost:5000/medicamentos/${form.slot}`, {
        method: "DELETE",
      });
    }
    let dataCompleta = "";
    const hoje = new Date();
    if (form.dia === "hoje") {
      const ano = hoje.getFullYear();
      const mes = String(hoje.getMonth() + 1).padStart(2, "0");
      const dia = String(hoje.getDate()).padStart(2, "0");
      dataCompleta = `${ano}-${mes}-${dia} ${form.horario}`;
    } else if (form.dia === "amanha") {
      const amanha = new Date(hoje);
      amanha.setDate(hoje.getDate() + 1);
      const ano = amanha.getFullYear();
      const mes = String(amanha.getMonth() + 1).padStart(2, "0");
      const dia = String(amanha.getDate()).padStart(2, "0");
      dataCompleta = `${ano}-${mes}-${dia} ${form.horario}`;
    } else if (form.dia === "data" && form.data_escolhida) {
      dataCompleta = `${form.data_escolhida} ${form.horario}`;
    } else {
      setMessage("Por favor, selecione o dia corretamente.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/medicamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot: form.slot,
          nome: form.nome,
          horario: dataCompleta,
          recorrente: form.recorrente,
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
        recorrente: false,
      });
    } catch (error) {
      setMessage("Erro ao cadastrar medicamento. Tente novamente.");
    }
  };

  // Altere a função removerMedicamento para usar setMessage e esconder após 5 segundos
  const removerMedicamento = async (slotIdx) => {
    if (!window.confirm("Tem certeza que deseja remover este medicamento?")) return;
    try {
      const response = await fetch(`http://localhost:5000/medicamentos/${slotIdx + 1}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao remover medicamento");
      await fetchSlots();
      setMessage("Medicamento removido com sucesso!");
      // Esconde a mensagem após 5 segundos
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage("Erro ao remover medicamento.");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  // Checa a cada 5 segundos se existe medicamento para o horário atual
  useEffect(() => {
    const interval = setInterval(async () => {
      let data = [];
      try {
        const response = await fetch("http://localhost:5000/medicamentos");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        data = await response.json();
        const paddedData = [...data];
        while (paddedData.length < 3) {
          paddedData.push({ nome: "", horario: "", dia: "", data_escolhida: "" });
        }
        setSlots(paddedData.slice(0, 3));
      } catch (error) {
        setMessage("Erro ao carregar medicamentos. Tente novamente.");
      }

      const agora = new Date();
      const ano = agora.getFullYear();
      const mes = String(agora.getMonth() + 1).padStart(2, "0");
      const dia = String(agora.getDate()).padStart(2, "0");
      const hora = String(agora.getHours()).padStart(2, "0");
      const minuto = String(agora.getMinutes()).padStart(2, "0");

      const proximo = data.find(
        (slot) => {
          if (!slot || !slot.horario || !slot.nome || slot.notificado || alertasDesligados[slot.horario]) return false;
          const slotDate = new Date(slot.horario.replace(" ", "T"));
          // Mostra o lembrete se o horário já passou ou é agora, e não foi desligado
          return slotDate <= agora;
        }
      );
      if (proximo && proximo.nome) {
        setLembrete(proximo);
      } else {
        setLembrete(null);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [alertasEnviados, alertasDesligados]);

  const desligarAlerta = async (horario) => {
    setLembrete(null);
    setAlertasDesligados(prev => ({
      ...prev,
      [horario]: true
    }));
    setAlertaDesligadoMsg(true);
    setTimeout(() => setAlertaDesligadoMsg(false), 2000);

    setAlertasEnviados(prev => {
      const novo = { ...prev };
      delete novo[horario];
      return novo;
    });

    // NOVO: avisa o backend que o alerta foi desligado
    try {
      await fetch("http://localhost:5000/desligar-alerta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ horario }),
      });
    } catch (e) {
      // Se falhar, só ignora
    }
  };

  // O useEffect para esconder mensagem de sucesso pode ser simplificado para esconder qualquer mensagem após 5 segundos:
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Router>
      <div className="h-screen bg-gray-100 font-['Roboto'] flex flex-col md:flex-row">
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
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fadeIn"
              style={{ backdropFilter: "blur(2px)" }}
            >
              <div className="relative rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-violet-600 to-blue-500 overflow-hidden w-full max-w-2xl shadow-2xl">
                <div className="flex flex-col flex-1 w-full">
                  <span className="bg-violet-400 text-white text-xs px-4 py-1 rounded-full font-semibold shadow-sm z-10 mb-4 sm:mb-6 md:mb-4 mr-0 md:mr-6 self-start">
                    Alerta de medicamento
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2 break-words flex items-center gap-2">
                    <span role="img" aria-label="Alerta" className="text-3xl">🔔</span>
                    Hora de tomar <span className="text-yellow-300">{lembrete.nome}</span>
                  </h2>
                  <button
                    onClick={() => desligarAlerta(lembrete.horario)}
                    className="mt-6 border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition text-base shadow"
                  >
                    Desligar Alerta
                  </button>
                </div>
                <button
                  onClick={() => desligarAlerta(lembrete.horario)}
                  className="absolute top-4 right-6 text-white text-3xl font-bold bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition"
                  aria-label="Fechar alerta"
                  title="Fechar alerta"
                  type="button"
                >
                  ×
                </button>
                <div className="hidden sm:block absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none z-0">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 rounded-full bg-white/10"></div>
                    <div className="absolute inset-6 rounded-full bg-white/10"></div>
                    <div className="absolute inset-12 rounded-full bg-white/10"></div>
                    <div className="absolute inset-20 rounded-full bg-white/10"></div>
                  </div>
                </div>
              </div>
              <style>
                {`
                  @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                  .animate-fadeIn { animation: fadeIn 0.4s; }
                `}
              </style>
            </div>
          )}
          {alertaDesligadoMsg && (
            <div
              style={{
                position: 'fixed',
                top: 40,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#36d1c4',
                color: '#fff',
                padding: '18px 36px',
                borderRadius: 12,
                fontSize: 22,
                fontWeight: 700,
                zIndex: 3000,
                boxShadow: '0 2px 16px rgba(30,34,90,0.15)',
                animation: 'fadeIn 0.3s'
              }}
            >
              Alerta desligado!
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
