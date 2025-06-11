# ControlMed

Aplicação para controle de medicamentos, com interface web (React) e backend Node.js, integrável a dispositivos IoT (ex: Arduino).

## Funcionalidades

- Cadastro e gerenciamento de medicamentos
- Lembrete visual na tela para horários de medicação
- Integração futura com Arduino para alerta sonoro (buzzer)
- Estatísticas de uso
- Interface responsiva

## Tecnologias

- React (frontend)
- Node.js (backend)
- Tailwind CSS
- Integração planejada com Arduino via API

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/eduardosichelero/controlmed-app.git
   cd controlmed-app
   ```

2. Instale as dependências:
   ```sh
   npm run install-all
   ```

3. Inicie o projeto em modo desenvolvimento:
   ```sh
   npm run dev
   ```

## Scripts úteis

- `npm run dev` — Inicia frontend e backend em modo desenvolvimento
- `npm run start` — Inicia frontend e backend em modo produção
- `npm run build-client` — Gera build de produção do frontend

## Estrutura do Projeto

```
controlmed-project/
  client/      # Frontend React
  server/      # Backend Node.js
  .env         # Variáveis de ambiente (adicione manualmente)
```

## Observações

- Para integração com Arduino, será necessário configurar a comunicação no backend.
- Não esqueça de criar o arquivo `.env` com as variáveis necessárias.

## Licença

ISC

---
Desenvolvido por [Seu Nome ou Equipe]