# ControlMed

Aplicação para controle de medicamentos, com interface web moderna (React + Tailwind CSS) e backend Node.js, integrável a dispositivos IoT (ex: Arduino ou Raspberry Pi).

## Funcionalidades

- Cadastro, edição e remoção de medicamentos
- Lembrete visual na tela para horários de medicação, com alerta centralizado e botão para desligar
- Notificações automáticas e feedback visual moderno
- Integração futura com Arduino/Raspberry Pi para alerta sonoro (buzzer/motor)
- Estatísticas de uso e histórico
- Interface responsiva e acessível

## Tecnologias

- React (frontend)
- Tailwind CSS (estilização)
- Node.js (backend)
- Integração planejada com Arduino/Raspberry Pi via API REST

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
controlmed-app/
  client/      # Frontend React
  server/      # Backend Node.js
  .env         # Variáveis de ambiente (adicione manualmente)
```

## Observações

- Para integração com Arduino/Raspberry Pi, será necessário configurar a comunicação no backend.
- Crie o arquivo `.env` com as variáveis necessárias (exemplo disponível no projeto).
- O alerta visual é exibido no horário do medicamento e pode ser desligado pela interface.

## Licença

ISC

---

Desenvolvido por [Seu Nome ou Equipe]