---
icon: folder-tree
---

# Instalação e configuração

### ⚙️ 2. Instalação

Para rodar o projeto em seu ambiente de desenvolvimento, você precisará configurar tanto o **backend (servidor)** quanto o **frontend (cliente)**.

#### 📦 Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:

* 🟢 **Node.js e npm** – Para executar o cliente React
* 🐍 **Python 3** – Para executar o servidor Flask
* 🔌 **Arduino IDE** – Para carregar o código no seu dispositivo Arduino
* 🧬 **Git** – Para clonar o repositório do projeto

***

#### 🖥️ Configuração do Backend (Servidor)

1.  Clone o repositório e navegue até a pasta do servidor:

    ```bash
    git clone <url-do-seu-repositorio>
    cd <pasta-do-projeto>/server

    ```
2.  Crie e ative um ambiente virtual (recomendado):

    **Windows:**

    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    ```

    **macOS/Linux:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Instale as dependências do Python:

    ```bash
    pip install Flask Flask-Cors pyserial
    ```
4.  Configure a porta do Arduino:

    No arquivo `server.py`, altere a variável `ARDUINO_PORT` para a porta correta do seu Arduino:

    ```python
    # server.py
    ARDUINO_PORT = 'COM3'  # Altere para sua porta
    ```
5.  Execute o servidor:

    ```bash
    python server.py
    ```

    O backend estará rodando em:    \
    📍 [**http://localhost:5000**](http://localhost:5000)

***

#### 🌐 Configuração do Frontend (Cliente)

1.  Abra um novo terminal e navegue até a pasta do cliente:

    ```bash
    cd <pasta-do-projeto>/client
    ```
2.  Instale as dependências do Node.js:

    ```bash
    npm install
    ```
3.  Execute a aplicação React:

    ```bash
    npm start
    ```

    O frontend estará acessível em:    \
    📍 [**http://localhost:3000**](http://localhost:3000)    \
    (e se conectará automaticamente ao backend)

***

### 🧱 3. Estrutura do Projeto

O projeto é dividido em duas partes principais:

* `client/` → Frontend (React)
* `server/` → Backend (Flask)

***

#### 🎨 client (Frontend - React)

Responsável por toda a interação com o usuário.

* **App.js**  \
  Componente raiz da aplicação. Gerencia:
  * Estado global (lista de medicamentos, formulário, mensagens e loading)
  * Lógica de comunicação com a API
  * Alertas de medicamentos
  * Navegação entre páginas
* **/components**  \
  Componentes reutilizáveis:
  * `Sidebar.js` – Barra de navegação lateral
  * `BannerProximoMedicamento.js` – Banner com o próximo medicamento agendado
  * `Loader.js` – Animação de carregamento durante requisições à API
* **/pages**  \
  Telas principais da aplicação:
  * `DashboardPage.js` – Página inicial com slots e formulário
  * `MedicamentosPage.js` – Lista completa de medicamentos agendados
  * `CadastrarPage.js` – Formulário para adicionar ou editar medicamentos
  * `EstatisticasPage.js` – Visualização de dados e estatísticas
  * `MedicamentosComunsPage.js` – Página informativa sobre medicamentos comuns
