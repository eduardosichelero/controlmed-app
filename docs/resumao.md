---
icon: newspaper
---

# Resumão

### 💊 Visão Geral

O **ControlMed** é uma solução completa para controle de medicamentos, composta por uma aplicação web moderna (frontend em **React + Tailwind CSS**) e um backend em **Python (Flask)**, com integração opcional a dispositivos IoT como **Arduino** ou **Raspberry Pi**.

O sistema permite cadastrar, editar e remover medicamentos, além de emitir **lembretes visuais** e acionar **dispositivos físicos** para alertas sonoros ou liberação de compartimentos.

***

### 🖥️ Funcionalidades do Servidor (Backend - Flask)

* **API RESTful**: Gerencia dados dos medicamentos (cadastro, listagem e remoção).
* **Persistência**: Utiliza um arquivo `slots.json` para armazenar os medicamentos.
* **Monitoramento de horários**: A cada 5 segundos verifica se algum medicamento está agendado.
* **Acionamento de hardware**: Envia comandos via porta serial para o Arduino.
* **Thread segura**: Uso de `lock` para evitar conflitos de acesso.

#### 🔁 Rotas principais:

| Método | Rota                   | Descrição                             |
| ------ | ---------------------- | ------------------------------------- |
| GET    | `/medicamentos`        | Lista todos os medicamentos           |
| POST   | `/medicamentos`        | Cadastra ou atualiza um medicamento   |
| DELETE | `/medicamentos/<slot>` | Remove o medicamento do slot indicado |
| POST   | `/alerta-medicamento`  | Aciona o alerta físico via Arduino    |

***

### 📥 Detalhamento das Rotas

#### 1. Cadastro de Medicamentos

* **Endpoint**: `POST /medicamentos`
* **Corpo**:

```json
{
  "slot": 1,
  "nome": "Paracetamol",
  "horario": "2025-06-14 12:00",
  "recorrente": true
}
```

* **Resposta**:

```json
{"mensagem": "Medicamento cadastrado com sucesso!"}
```

#### 2. Listagem de Medicamentos

* **Endpoint**: `GET /medicamentos`
* **Resposta**:

```json
[
  {
    "nome": "Paracetamol",
    "horario": "2025-06-14 12:00",
    "recorrente": true,
    "slot": 1
  }
]
```

#### 3. Remoção de Medicamento

* **Endpoint**: `DELETE /medicamentos/<slot>`
* **Resposta**:

```json
{"mensagem": "Medicamento removido com sucesso!"}
```

#### 4. Alerta Manual

* **Endpoint**: `POST /alerta-medicamento`
* **Corpo**:

```json
{
  "nome": "Paracetamol",
  "slot": 1,
  "horario": "2025-06-14 12:00"
}
```

* **Resposta**:

```json
{"mensagem": "Alerta recebido e comando enviado para liberar 'Paracetamol'."}
```

#### 5. Monitoramento Automático

* Verifica constantemente os agendamentos.
* Aciona o Arduino no horário correto.
* Reagenda medicamentos recorrentes.
* Remove medicamentos não recorrentes após 2 minutos.

***

### 🧩 Funcionalidades do App (Frontend - React)

* **Dashboard**: Exibe slots, horários e status dos medicamentos.
* **Cadastro**: Formulário para incluir medicamentos com horário e recorrência.
* **Remoção**: Botão para excluir medicamentos.
* **Medicamentos Comuns**: Cadastro rápido a partir de sugestões populares.
* **Estatísticas**: Gráficos e contadores de medicamentos.
* **Banner**: Mostra o próximo medicamento a ser liberado.
* **Lembrete visual**: Alerta centralizado com botão para desligar.
* **Notificações automáticas**: Feedback para ações do usuário.
* **Interface responsiva e acessível**: Compatível com desktops e dispositivos móveis.

***

### 🔌 Integração com Arduino

#### 1. Requisitos

* Arduino Uno/Nano/Mega
* Cabo USB
* Python com `pyserial`
* Sketch Arduino para comandos via serial

#### 2. Sketch Exemplo

```cpp
void setup() {
  Serial.begin(9600);
  pinMode(8, OUTPUT);
}

void loop() {
  if (Serial.available()) {
    String comando = Serial.readStringUntil('\n');
    if (comando.startsWith("liberar:")) {
      digitalWrite(8, HIGH);
      delay(3000);
      digitalWrite(8, LOW);
    }
  }
}
```

#### 3. Configuração do Backend

* Ajuste no `server.py`:

```python
ARDUINO_PORT = 'COM3'  # Altere conforme necessário
```

#### 4. Funcionamento

* Backend envia: `liberar:<nome_do_medicamento>`
* Arduino executa: aciona motor ou buzzer

***

### 🔄 Fluxo Resumido

1. Usuário cadastra medicamento via web.
2. Backend monitora os horários.
3. No horário agendado:
   * Alerta visual é exibido.
   * Comando é enviado ao Arduino.
4. Arduino aciona motor ou buzzer.
5. Usuário desativa o alerta via interface.

***

### ⚙️ Observações Técnicas

* Suporte padrão para 3 slots (expansível).
* Backend salva dados em `slots.json`.
* Campo `notificado` evita alertas duplicados.
* Integração com Raspberry Pi possível com adaptações.
* Backend utiliza `thread` com `lock` para segurança.

***

### 🧾 Resumo Técnico

#### ✅ Backend - `server.py`

* Monitora e gerencia agendamentos
* Conecta com Arduino via Serial
* Aciona medicamentos conforme horário
* Armazena dados em JSON

#### 🌐 Endpoints da API (base: `http://localhost:5000`)

* `/medicamentos` (GET, POST, DELETE)
* `/alerta-medicamento` (POST)
