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
    navigate(`/cadastrar?nome=${encodeURIComponent(nome)}`);
  }

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4 md:px-8 py-8 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-4 tracking-tight drop-shadow-sm">
        Medicamentos Comuns
      </h1>
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {medicamentosComuns.map((med, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-blue-100 bg-white p-6 shadow-md flex flex-col min-h-[240px] transition-all duration-150 ease-out hover:scale-102 hover:shadow-lg"
          >
            <div className="font-bold text-lg text-blue-700 mb-2">{med.nome}</div>
            <div className="text-gray-700 text-base mb-2">{med.descricao}</div>
            <div className="text-gray-800 text-base mb-1">
              <span className="font-semibold">Dosagem:</span> {med.dosagem}
            </div>
            <div className="text-gray-800 text-base mb-4">
              <span className="font-semibold">Apresentação:</span> {med.apresentacao}
            </div>
            <button
              className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
              onClick={() => handleCadastrar(med.nome)}
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Cadastrar este medicamento
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}