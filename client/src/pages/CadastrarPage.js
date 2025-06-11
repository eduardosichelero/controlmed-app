import MedicamentoForm from "../components/MedicamentoForm";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CadastrarPage({ form, onChange, onSubmit }) {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nome = params.get("nome");
    if (nome && form.nome !== nome) {
      // Dispara o onChange para atualizar o campo nome
      onChange({ target: { name: "nome", value: nome } });
    }
    // eslint-disable-next-line
  }, [location.search]);

  return (
    <div className="w-full flex justify-center px-2 sm:px-4 md:px-8 py-6">
      <div className="w-full max-w-md">
        <MedicamentoForm form={form} onChange={onChange} onSubmit={onSubmit} />
      </div>
    </div>
  );
}