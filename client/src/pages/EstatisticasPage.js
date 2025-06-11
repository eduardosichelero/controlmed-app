import EstatisticasCard from "../components/EstatisticasCard";
export default function EstatisticasPage({ slots }) {
  return (
    <div className="w-full flex justify-center items-start px-2 sm:px-4 md:px-8 py-6">
      <EstatisticasCard slots={slots} />
    </div>
  );
}