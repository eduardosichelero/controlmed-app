import EstatisticasCard from "../components/EstatisticasCard";

function getMedicamentoMaisFrequente(slots) {
  const nomes = slots.filter((s) => s && s.nome).map((s) => s.nome);
  if (nomes.length === 0) return "Nenhum";
  const freq = {};
  nomes.forEach((nome) => {
    freq[nome] = (freq[nome] || 0) + 1;
  });
  const maisFrequente = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  return maisFrequente[0];
}

export default function EstatisticasPage({ slots }) {
  const total = slots.filter((s) => s && s.nome).length;
  const recorrentes = slots.filter((s) => s && s.recorrente).length;
  const maisFrequente = getMedicamentoMaisFrequente(slots);

  return (
    <div className="w-full flex justify-center items-start px-2 sm:px-4 md:px-8 py-6">
      <EstatisticasCard slots={slots}>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1 bg-blue-100 text-blue-900 rounded-lg px-4 py-6 flex flex-col items-center shadow">
            <span className="text-3xl font-bold">{total}</span>
            <span className="mt-2 font-semibold">Medicamentos cadastrados</span>
          </div>
          <div className="flex-1 bg-yellow-100 text-yellow-900 rounded-lg px-4 py-6 flex flex-col items-center shadow">
            <span className="text-3xl font-bold">{recorrentes}</span>
            <span className="mt-2 font-semibold">Recorrentes</span>
          </div>
          <div className="flex-1 bg-green-100 text-green-900 rounded-lg px-4 py-6 flex flex-col items-center shadow">
            <span className="text-2xl font-bold">{maisFrequente}</span>
            <span className="mt-2 font-semibold">Mais frequente</span>
          </div>
        </div>
      </EstatisticasCard>
    </div>
  );
}