# 💊 ControlMed

![](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge\&logo=javascript\&logoColor=%23F7DF1E) ![](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge\&logo=react\&logoColor=%2361DAFB) ![](https://img.shields.io/badge/python-3670A0?style=for-the-badge\&logo=python\&logoColor=ffdd54) ![](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge\&logo=flask\&logoColor=white) ![](https://img.shields.io/badge/-Arduino-00979D?style=for-the-badge\&logo=Arduino\&logoColor=white) ![](https://img.shields.io/badge/GitBook-%23000000.svg?style=for-the-badge\&logo=gitbook\&logoColor=white)

📚 [**Acesse a documentação completa no GitBook**](https://eduardos-organization-23.gitbook.io/controlmed/)

Bem-vindo ao **ControlMed**, um sistema inteligente para controle e liberação de medicamentos com integração entre:

* Frontend moderno com **React + Tailwind CSS**
* Backend robusto com **Python Flask**
* Integração com dispositivos **IoT** como Arduino e Raspberry Pi

### 🔄 Fluxo da aplicação

### 📑 Sumário

* Funcionalidades principais
* Instalação rápida
* Explore mais
* Integrantes do Projeto

***

### ✅ Funcionalidades principais

* Cadastro e agendamento de medicamentos &#x20;
* Lembretes visuais e sonoros &#x20;
* Acionamento de hardware no horário do remédio &#x20;
* Interface web acessível e responsiva &#x20;

***

### ⚙️ Instalação rápida

```bash
git clone [https://github.com/seu-usuario/controlmed-app.git](https://github.com/seu-usuario/controlmed-app.git)
cd controlmed-app/client
npm install
npm start
```

Certifique-se de que o backend está rodando em `http://localhost:5000`.

***

### 🛠️ Script de inicialização rápida e ajuste de horário

Para facilitar o início do sistema e garantir que tudo está sincronizado, siga este passo a passo ou utilize um script como exemplo:

**Exemplo de script: ajustaHora.sh**

```bash
#!/bin/bash

# 1. Ajusta a data e hora para o dia de hoje e hora atual
sudo date -s "$(date '+%Y-%m-%d %H:%M:00')"

# 2. Acesse a pasta do servidor
cd ~/Desktop/servidor

# 3. Ative o ambiente virtual
source venv/bin/activate

# 4. Entre na pasta do backend
cd server

# 5. Rode o servidor Flask
python server.py
```

***

#### ✔️ Checklist rápido antes de rodar

* Verifique se o **Arduino está conectado na porta preta de cima**
* Descubra a porta do Arduino:

```bash
ls /dev/ttyACM*
```

* Ajuste a porta correta no arquivo `server.py`:

```python
ARDUINO_PORT = '/dev/ttyACM0'  # ou /dev/ttyACM1, conforme o resultado do comando acima
```

***

### 🚀 Explore mais

* **Como instalar e configurar:** Veja instruções detalhadas na [documentação do GitBook](https://eduardos-organization-23.gitbook.io/controlmed/)
* **Como a API funciona:** Exemplos de uso e endpoints disponíveis na seção de API do GitBook
* **Resumo técnico completo:** Arquitetura, fluxos e integrações descritos na documentação do GitBook

***

### 👥 Integrantes do Projeto

| RA      | Nome                 |
| ------- | -------------------- |
| 1134868 | Ábner Panazollo      |
| 1134433 | Ariel Diefenthaeler  |
| 1135384 | Gabriel Onofre       |
| 1134933 | Eduardo Sichelero    |
| 1135046 | Enzo Schultz         |
| 1134821 | Vitor Quadros        |
