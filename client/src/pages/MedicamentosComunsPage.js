import React from "react";
import { useNavigate } from "react-router-dom";

const medicamentosComuns = [
  {
    nome: "Paracetamol",
    descricao: "Analgésico e antitérmico. Usado para dor e febre.",
    dosagem: "500mg a cada 6-8h",
    apresentacao: "Comprimido, gotas, xarope",
  },
  {
    nome: "Dipirona",
    descricao: "Analgésico e antitérmico. Usado para dor e febre.",
    dosagem: "500mg a cada 6-8h",
    apresentacao: "Comprimido, gotas, solução oral",
  },
  {
    nome: "Ibuprofeno",
    descricao: "Anti-inflamatório, analgésico e antitérmico.",
    dosagem: "200mg a 400mg a cada 6-8h",
    apresentacao: "Comprimido, suspensão oral",
  },
  {
    nome: "Amoxicilina",
    descricao: "Antibiótico para infecções bacterianas.",
    dosagem: "500mg a cada 8h",
    apresentacao: "Comprimido, suspensão oral",
  },
  {
    nome: "Losartana",
    descricao: "Anti-hipertensivo para pressão alta.",
    dosagem: "50mg 1x ao dia",
    apresentacao: "Comprimido",
  },
  {
    nome: "Metformina",
    descricao: "Antidiabético oral.",
    dosagem: "500mg a 850mg 2-3x ao dia",
    apresentacao: "Comprimido",
  },
  {
    nome: "Omeprazol",
    descricao: "Inibidor de bomba de prótons para gastrite e refluxo.",
    dosagem: "20mg 1x ao dia",
    apresentacao: "Cápsula",
  },
  {
    nome: "Simeticona",
    descricao: "Alívio de gases intestinais.",
    dosagem: "40mg a 125mg após as refeições",
    apresentacao: "Comprimido, gotas",
  },
];

export default function MedicamentosComunsPage() {
  const navigate = useNavigate();

  function handleCadastrar(nome) {
    // Redireciona para a tela de cadastro já preenchendo o nome via query string
    navigate(`/cadastrar?nome=${encodeURIComponent(nome)}`);
  }

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4 md:px-8 py-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Medicamentos Comuns</h1>
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicamentosComuns.map((med, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow flex flex-col min-h-[220px]"
          >
            <div className="font-semibold text-xl text-blue-800 mb-1">{med.nome}</div>
            <div className="text-gray-600 text-base mb-2">{med.descricao}</div>
            <div className="text-gray-800 text-base">
              <span className="font-medium">Dosagem:</span> {med.dosagem}
            </div>
            <div className="text-gray-800 text-base mb-4">
              <span className="font-medium">Apresentação:</span> {med.apresentacao}
            </div>
            <button
              className="mt-auto bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 rounded-lg transition"
              onClick={() => handleCadastrar(med.nome)}
              type="button"
            >
              Cadastrar este medicamento
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}