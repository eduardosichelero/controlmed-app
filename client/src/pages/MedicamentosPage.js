import SlotsList from "../components/SlotsList";
export default function MedicamentosPage({ slots, onRemove }) {
  return (
    <div className="w-full flex justify-center items-start px-2 sm:px-4 md:px-8 py-4">
      <div className="w-full max-w-5xl flex justify-center">
        <SlotsList slots={slots} onRemove={onRemove} />
      </div>
    </div>
  );
}