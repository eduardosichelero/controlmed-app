import React, { useState } from "react";
import Icon from "./Icon";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Botão menu hambúrguer visível apenas em telas pequenas */}
      <button
        className="fixed top-3 left-3 z-50 bg-blue-100 p-2 rounded-lg shadow-lg md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        type="button"
      >
        <Icon name={open ? "close" : "menu"} className="text-2xl text-blue-700" />
      </button>

      {/* Sidebar como menu superior em telas pequenas, lateral em desktop */}
      <nav
        className={`
          fixed top-0 left-0 w-full z-40 bg-gradient-to-b from-blue-50 to-white border-b shadow-md flex flex-col
          transition-transform duration-300
          ${open ? "translate-y-0" : "-translate-y-full"}
          md:static md:translate-y-0 md:w-64 md:min-h-screen md:h-screen md:border-b-0 md:border-r
          md:flex-col
        `}
        style={{ minWidth: "0" }}
      >
        {/* Topo: Logo */}
        <div className="flex items-center gap-3 px-6 py-5 md:py-7 md:px-6">
          <div>
            <div className="font-extrabold text-2xl md:text-3xl text-blue-700 tracking-wide">
              ControlMed
            </div>
            <div className="text-xs text-blue-400 font-medium">
              Controle de Medicamentos
            </div>
          </div>
        </div>
        {/* Menu */}
        <ul className="space-y-2 px-2 mt-2 md:mt-2 md:px-2 flex flex-col md:block">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-5 py-3 rounded-xl font-bold shadow-sm hover:scale-105 transition
                ${location.pathname === "/dashboard" ? "bg-gradient-to-r from-violet-100 to-blue-100 text-blue-900" : "hover:bg-blue-50 text-blue-700"}
              `}
              onClick={() => setOpen(false)}
            >
              <Icon name="dashboard" className="text-2xl" />
              <span className="hidden sm:inline md:inline">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/medicamentos"
              className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold hover:scale-105 transition
                ${location.pathname === "/medicamentos" ? "bg-gradient-to-r from-violet-100 to-blue-100 text-blue-900" : "hover:bg-blue-50 text-blue-700"}
              `}
              onClick={() => setOpen(false)}
            >
              <Icon name="medication" className="text-2xl" />
              <span className="hidden sm:inline md:inline">Medicamentos</span>
            </Link>
          </li>
          <li>
            <Link
              to="/medicamentos-comuns"
              className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold hover:scale-105 transition
                ${location.pathname === "/medicamentos-comuns" ? "bg-gradient-to-r from-violet-100 to-blue-100 text-blue-900" : "hover:bg-blue-50 text-blue-700"}
              `}
              onClick={() => setOpen(false)}
            >
              <Icon name="medical_services" className="text-2xl" />
              <span>Medicamentos Comuns</span>
            </Link>
          </li>
          <li>
            <Link
              to="/cadastrar"
              className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold hover:scale-105 transition
                ${location.pathname === "/cadastrar" ? "bg-gradient-to-r from-violet-100 to-blue-100 text-blue-900" : "hover:bg-blue-50 text-blue-700"}
              `}
              onClick={() => setOpen(false)}
            >
              <Icon name="add_circle" className="text-2xl" />
              <span className="hidden sm:inline md:inline">Cadastrar</span>
            </Link>
          </li>
          <li>
            <Link
              to="/estatisticas"
              className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold hover:scale-105 transition
                ${location.pathname === "/estatisticas" ? "bg-gradient-to-r from-violet-100 to-blue-100 text-blue-900" : "hover:bg-blue-50 text-blue-700"}
              `}
              onClick={() => setOpen(false)}
            >
              <Icon name="bar_chart" className="text-2xl" />
              <span className="hidden sm:inline md:inline">Estatísticas</span>
            </Link>
          </li>
        </ul>
        {/* Usuário fixado na base (visível apenas em desktop) */}
        <div className="hidden md:flex mt-auto px-6 py-6 border-t bg-white/60">
          <div className="flex items-center gap-3">
            <span className="inline-block w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow">
              U
            </span>
            <span className="text-blue-900 text-base font-semibold">Usuário</span>
          </div>
        </div>
      </nav>

      {/* Overlay para fechar o menu em mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        />
      )}
    </>
  );
}