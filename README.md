---
icon: book-open
---

# Introdução

## 💊ControlMed

### 📘 O que é

Este projeto é um sistema completo de automação para controle e dispensação de medicamentos, ideal para auxiliar no cuidado com pacientes que precisam tomar remédios em horários específicos. A aplicação é dividida em duas partes principais:

* **Frontend (cliente)**: Interface web desenvolvida em React, onde o usuário pode cadastrar, visualizar e gerenciar os medicamentos.
* **Backend (servidor)**: Aplicação Flask que gerencia os agendamentos, aciona o hardware (Arduino) no horário certo e mantém os dados sincronizados.

### 🎯 Objetivo

Garantir que medicamentos sejam liberados no horário correto com segurança e automação, evitando esquecimentos e reduzindo o risco de erros humanos.

### 🔌 Componentes do Projeto

* **ReactJS**: Interface moderna e responsiva.
* **Flask (Python)**: API RESTful e lógica de negócios.
* **Arduino**: Responsável por liberar fisicamente os medicamentos por meio de um motor.
* **JSON**: Armazenamento simples e eficaz dos agendamentos locais.

### 🚀 Funcionalidades

* Cadastro de medicamentos por horário e recorrência.
* Alerta de horário e acionamento automático do dispensador.
* Suporte a medicamentos recorrentes.
* Interface gráfica amigável para facilitar o uso por cuidadores ou pacientes.
* Comunicação serial com Arduino para controle físico.

### 👤 Público-Alvo

* Cuidadores de idosos
* Pacientes que seguem cronogramas rigorosos de medicação
* Profissionais de saúde que buscam soluções acessíveis de automação
