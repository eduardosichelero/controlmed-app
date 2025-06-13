import MedicamentoForm from "../components/MedicamentoForm";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CadastrarPage({ form, onChange, onSubmit }) {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nome = params.get("nome");
    if (nome && form.nome !== nome) {
      onChange({ target: { name: "nome", value: nome } });
    }
    // eslint-disable-next-line
  }, [location.search]);

  return (
    <div className="w-full h-full min-h-0 flex justify-center items-center px-2 sm:px-4 md:px-8">
      <div className="w-full max-w-2xl">
        <MedicamentoForm form={form} onChange={onChange} onSubmit={onSubmit} />
      </div>
    </div>
  );
}