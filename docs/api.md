---
icon: python
---

# API

#### 🔧 server (Backend - Flask)

Responsável pela lógica central da aplicação, comunicação com o hardware (Arduino) e gerenciamento dos agendamentos.

**📁 Estrutura de Arquivos**

```

server/
├── server.py           # Arquivo principal do backend (executa o servidor Flask)
├── agendamentos.json   # Armazena os dados dos medicamentos agendados
└── utils/
├── scheduler.py    # Lógica para agendamento e verificação de horários
└── arduino.py      # Comunicação serial com o Arduino

```

**🧠 Explicação dos Arquivos**

* **server.py**
  * Inicia o servidor Flask
  * Define rotas da API (`/medicamentos`, `/agendar`, etc.)
  * Gerencia CORS e inicializa agendadores
  * Lê e escreve no `agendamentos.json`
  * Se comunica com o Arduino via `arduino.py`
* **agendamentos.json**
  * Banco de dados local e simples para armazenar os medicamentos agendados, suas horas e repetições.
  *   Exemplo de estrutura:

      ```json
      {
        "medicamentos": [
          {
            "nome": "Dipirona",
            "hora": "08:00",
            "recorrente": true
          }
        ]
      }
      ```
* **utils/scheduler.py**
  * Contém a lógica de verificação de tempo
  * Verifica constantemente os agendamentos
  * Aciona o Arduino quando chega a hora do medicamento
* **utils/arduino.py**
  * Utiliza a biblioteca `pyserial` para comunicação serial com o Arduino
  * Envia sinais simples (ex: "DISPENSAR") via porta configurada
  * Trata erros de conexão

**📡 Rotas da API**

* `GET /medicamentos`\
  Retorna todos os medicamentos agendados
* `POST /agendar`\
  Adiciona um novo medicamento ao agendamento
* `DELETE /medicamentos/<id>`\
  Remove um medicamento agendado

***

#### ✅ Tecnologias Utilizadas

* **Flask** – Framework leve e eficiente para APIs
* **Flask-CORS** – Permite que o frontend (em outra porta) acesse a API
* **PySerial** – Comunicação com o Arduino via porta serial
* **JSON** – Armazenamento simples e legível dos dados

***

#### 📢 Observação Importante

⚠️ **A comunicação com o Arduino depende da porta correta estar configurada!**\
Altere a variável `ARDUINO_PORT` em `server.py` para refletir o seu sistema:

* Windows: `COM3`, `COM4`...
* Linux/macOS: `/dev/ttyUSB0`, `/dev/ttyACM0`...

***
