import SlotsList from "../components/SlotsList";
import MedicamentoForm from "../components/MedicamentoForm";
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

export default function DashboardPage({ slots, onRemove, form, onChange, onSubmit }) {
  const total = slots.filter((s) => s && s.nome).length;
  const recorrentes = slots.filter((s) => s && s.recorrente).length;
  const maisFrequente = getMedicamentoMaisFrequente(slots);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 px-2 sm:px-4 md:px-8 pb-4 sm:pb-8">
      <div className="flex justify-center w-full lg:w-1/3">
        <SlotsList slots={slots} onRemove={onRemove} />
      </div>
      <div className="flex justify-center w-full lg:w-1/3">
        <MedicamentoForm form={form} onChange={onChange} onSubmit={onSubmit} />
      </div>
      <div className="flex justify-center w-full lg:w-1/3">
        <EstatisticasCard slots={slots}>
          <div className="flex flex-col gap-2 mt-4">
            <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl px-4 py-3 flex flex-col items-center shadow-sm">
              <span className="text-2xl font-extrabold">{total}</span>
              <span className="mt-1 font-semibold text-blue-700 text-center text-sm">Medicamentos cadastrados</span>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-xl px-4 py-3 flex flex-col items-center shadow-sm">
              <span className="text-2xl font-extrabold">{recorrentes}</span>
              <span className="mt-1 font-semibold text-yellow-700 text-center text-sm">Recorrentes</span>
            </div>
            <div className="bg-green-50 border border-green-200 text-green-900 rounded-xl px-4 py-3 flex flex-col items-center shadow-sm">
              <span className="text-lg font-bold">{maisFrequente}</span>
              <span className="mt-1 font-semibold text-green-700 text-center text-sm">Mais frequente</span>
            </div>
          </div>
        </EstatisticasCard>
      </div>
    </div>
  );
}