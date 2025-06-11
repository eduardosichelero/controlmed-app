import SlotsList from "../components/SlotsList";
import MedicamentoForm from "../components/MedicamentoForm";
import EstatisticasCard from "../components/EstatisticasCard";

export default function DashboardPage({ slots, onRemove, form, onChange, onSubmit }) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 px-2 sm:px-4 md:px-8 pb-4 sm:pb-8">
      <div className="flex justify-center">
        <SlotsList slots={slots} onRemove={onRemove} />
      </div>
      <div className="flex justify-center">
        <MedicamentoForm form={form} onChange={onChange} onSubmit={onSubmit} />
      </div>
      <div className="flex justify-center">
        <EstatisticasCard slots={slots} />
      </div>
    </div>
  );
}