# ControlMed

Aplicação para controle de medicamentos, com interface web moderna (React + Tailwind CSS) e backend Python (Flask), integrável a dispositivos IoT como Arduino ou Raspberry Pi.

## Funcionalidades

- Cadastro e remoção de medicamentos em até 3 slots físicos
- Lembrete visual na tela para horários de medicação, com alerta centralizado e botão para desligar
- Notificações automáticas e feedback visual moderno
- Integração com Arduino/Raspberry Pi para alerta sonoro ou liberação automática de compartimentos
- Estatísticas de uso e próximos horários
- Interface responsiva e acessível
- Lista de medicamentos comuns para cadastro rápido

## Tecnologias

- React (frontend)
- Tailwind CSS (estilização)
- Python + Flask (backend)
- PySerial (comunicação com Arduino)
- Integração via API REST

## Instalação

### 1. Clone o repositório:
```sh
git clone https://github.com/eduardosichelero/controlmed-app.git
cd controlmed-app
```

### 2. Instale as dependências do frontend:
```sh
cd client
npm install
```

### 3. Instale as dependências do backend:
```sh
cd ../server
pip install flask flask-cors pyserial
```

### 4. Inicie o backend:
```sh
python server.py
```

### 5. Inicie o frontend:
```sh
cd ../client
npm start
```

## Estrutura do Projeto

```
controlmed-app/
  client/      # Frontend React
  server/      # Backend Python (Flask)
  DOCS.md      # Documentação detalhada do sistema
  README.md    # Este arquivo
```

## Integração com Arduino

- O backend se conecta ao Arduino via porta serial (ex: COM3, 9600 baud).
- Quando chega o horário do medicamento, o backend envia o comando:
  ```
  liberar:<nome_do_medicamento>\n
  ```
- O Arduino deve estar programado para receber esse comando e acionar o motor, servo ou buzzer correspondente.

### Exemplo de Sketch Arduino

```cpp
void setup() {
  Serial.begin(9600);
  pinMode(8, OUTPUT); // Exemplo: pino 8 controla um motor ou buzzer
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

## Observações

- O sistema suporta até 3 slots de medicamentos por padrão.
- Os dados dos slots são salvos em `slots.json` no backend.
- Para aumentar o número de slots, ajuste o backend e o frontend conforme necessário.
- Consulte o arquivo `DOCS.md` para detalhes completos de rotas, exemplos de uso e integração.

## Licença

ISC

---

Desenvolvido por Eduardo Sichelero e colaboradores.