---
icon: newspaper
---

# Resumão

### ✅ Resumo do Backend (Flask) e API

#### 🔧 Backend - `server.py`

* **Função principal**: Controla os agendamentos de medicamentos e comunica-se com o Arduino.
* **Conexão com Arduino** via porta serial (`COM3` ou `/dev/ttyUSB0`).
* **Medicamentos** são armazenados em `slots.json`.
* **Verificação automática** a cada 5 segundos:
  * Aciona o motor no horário certo.
  * Reagenda medicamentos recorrentes.
  * Remove os não recorrentes após 2 minutos.

***

#### 🌐 Endpoints da API (base: `http://localhost:5000`)

| Método | Rota                   | Função                                                                 |
| ------ | ---------------------- | ---------------------------------------------------------------------- |
| GET    | `/medicamentos`        | Lista todos os medicamentos agendados nos 3 slots.                     |
| POST   | `/medicamentos`        | Cadastra ou atualiza um medicamento em um slot.                        |
| DELETE | `/medicamentos/<slot>` | Remove o medicamento de um slot específico (1, 2 ou 3).                |
| POST   | `/alerta-medicamento`  | Aciona o motor manualmente para liberar o medicamento.                 |
| POST   | `/desligar-alerta`     | Desativa um alerta e prepara o reagendamento (para casos recorrentes). |
