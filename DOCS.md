# ControlMed - Documentação

## Visão Geral

O **ControlMed** é uma solução completa para controle de medicamentos, composta por uma aplicação web moderna (frontend em React + Tailwind CSS) e um backend em Python (Flask), com integração opcional a dispositivos IoT como Arduino ou Raspberry Pi. O sistema permite cadastrar, editar e remover medicamentos, além de emitir lembretes visuais e acionar dispositivos físicos para alertas sonoros ou liberação de compartimentos.

---

## Funcionalidades do Servidor (Backend Flask)

- **API RESTful:** Gerencia os dados dos medicamentos (cadastrar, listar, remover).
- **Persistência:** Salva os slots de medicamentos em arquivo JSON.
- **Monitoramento de horários:** Verifica a cada 5 segundos se algum medicamento está agendado para o horário atual.
- **Acionamento de hardware:** Quando chega o horário, envia comando via porta serial para o Arduino liberar o medicamento ou emitir alerta sonoro.
- **Thread segura:** Utiliza lock para evitar conflitos de acesso aos dados.
- **Rotas principais:**
  - `GET /medicamentos` — Lista os medicamentos cadastrados.
  - `POST /medicamentos` — Cadastra ou atualiza um medicamento.
  - `DELETE /medicamentos/<slot>` — Remove um medicamento do slot.
  - `POST /alerta-medicamento` — Aciona o alerta físico via Arduino.

### Detalhamento das Rotas

#### 1. Cadastro de Medicamentos

- **Endpoint:** `POST /medicamentos`
- **Descrição:** Cadastra um medicamento em um dos três slots disponíveis.
- **Corpo da requisição:**
  ```json
  {
    "slot": 1,
    "nome": "Paracetamol",
    "horario": "2025-06-14 12:00",
    "recorrente": true
  }
  ```
- **Resposta:**  
  `{"mensagem": "Medicamento cadastrado com sucesso!"}`

#### 2. Listagem de Medicamentos

- **Endpoint:** `GET /medicamentos`
- **Descrição:** Retorna todos os slots com informações dos medicamentos cadastrados.
- **Resposta:**
  ```json
  [
    {
      "nome": "Paracetamol",
      "horario": "2025-06-14 12:00",
      "recorrente": true,
      "slot": 1
    },
    ...
  ]
  ```

#### 3. Remoção de Medicamento

- **Endpoint:** `DELETE /medicamentos/<slot>`
- **Descrição:** Remove o medicamento do slot informado (1, 2 ou 3).
- **Resposta:**  
  `{"mensagem": "Medicamento removido com sucesso!"}`

#### 4. Alerta Manual de Medicamento

- **Endpoint:** `POST /alerta-medicamento`
- **Descrição:** Aciona manualmente o motor do Arduino para liberar o medicamento do slot informado.
- **Corpo da requisição:**
  ```json
  {
    "nome": "Paracetamol",
    "slot": 1,
    "horario": "2025-06-14 12:00"
  }
  ```
- **Resposta:**  
  `{"mensagem": "Alerta recebido e comando enviado para liberar 'Paracetamol'."}`

#### 5. Monitoramento Automático

- O servidor monitora continuamente os horários dos medicamentos.
- Quando chega o horário de um medicamento:
  - Aciona o motor do Arduino para liberar o compartimento.
  - Marca o slot como "notificado".
  - Se for recorrente, agenda para o próximo dia.
  - Se não for recorrente, remove o medicamento do slot após 2 minutos.

---

## Funcionalidades do App (Frontend React)

- **Dashboard:** Visualização dos slots, horários e status dos medicamentos.
- **Cadastro:** Formulário para cadastrar medicamentos em slots, definindo nome, horário e recorrência.
- **Remoção:** Botão para remover medicamentos dos slots.
- **Medicamentos Comuns:** Lista de medicamentos populares para cadastro rápido.
- **Estatísticas:** Resumo dos medicamentos cadastrados e próximos horários.
- **Banner:** Exibe o próximo medicamento a ser liberado e o tempo restante.
- **Lembrete visual:** Exibe um alerta centralizado na tela no horário do medicamento, com botão para desligar o alerta.
- **Notificações automáticas:** Mensagens de feedback para ações do usuário (ex: cadastro, remoção, alerta desligado).
- **Interface responsiva:** Funciona em desktop e dispositivos móveis.
- **Acessibilidade:** Cores, botões e textos pensados para fácil leitura e interação.

---

## Como integrar ao Arduino

### 1. Requisitos

- Arduino Uno, Nano ou Mega
- Cabo USB para conexão com o servidor
- Python com biblioteca `pyserial` instalada
- Sketch Arduino para receber comandos via Serial

### 2. Sketch Exemplo para Arduino

```cpp
void setup() {
  Serial.begin(9600);
  pinMode(8, OUTPUT); // Exemplo: pino 8 controla um motor ou buzzer
}

void loop() {
  if (Serial.available()) {
    String comando = Serial.readStringUntil('\n');
    if (comando.startsWith("liberar:")) {
      // Aciona o motor/buzzer por 3 segundos
      digitalWrite(8, HIGH);
      delay(3000);
      digitalWrite(8, LOW);
    }
  }
}
```

### 3. Configuração do Backend

- No arquivo `server.py`, ajuste a linha:
  ```python
  ARDUINO_PORT = 'COM3'  # Altere para a porta correta do seu Arduino
  ```
- Certifique-se de que o Arduino está conectado e o Sketch acima está carregado.

### 4. Funcionamento

- Quando o horário do medicamento chega, o backend envia via Serial o comando `liberar:<nome_do_medicamento>\n`.
- O Arduino recebe esse comando e aciona o motor, buzzer ou outro dispositivo conforme programado.

---

## Fluxo Resumido

1. Usuário cadastra medicamentos pela interface web.
2. O backend monitora os horários.
3. No horário agendado, exibe alerta visual na tela e envia comando para o Arduino.
4. O Arduino executa a ação física (ex: liberar compartimento, tocar buzzer).
5. Usuário pode desligar o alerta pela interface.

---

## Observações Técnicas

- O sistema suporta até 3 slots de medicamentos por padrão.
- Para aumentar o número de slots, ajuste o backend e o frontend conforme necessário.
- O servidor salva os dados dos slots em `slots.json` para persistência.
- O campo `slot` é enviado ao frontend para facilitar a identificação.
- O campo `notificado` é usado internamente para evitar acionamentos duplicados.
- O sistema é thread-safe usando locks para acesso aos slots.
- A integração com Raspberry Pi pode ser feita de forma semelhante, adaptando o código de hardware.

---

Desenvolvido por Eduardo Sichelero e colaboradores.