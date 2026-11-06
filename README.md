# Agende+ — Backend

Backend adaptado do projeto-base para o sistema Agende+ da Marista Escola Social Cascavel.

## Estrutura

A estrutura original do backend foi mantida: `src/modelos`, `src/controladores`, `src/rotas`, `src/database.js`, `src/app.js` e `server.js`.

Os recursos de biblioteca foram substituídos pelos recursos do Agende+: usuários, alunos, profissionais, agendamentos, disponibilidade e notificações.

## Banco de dados

O projeto usa **Supabase (PostgreSQL)**. Execute primeiro `supabase/schema.sql` no SQL Editor do Supabase e, se quiser dados de teste, depois `supabase/seed.sql`.

## Configuração

Copie `.env.example` para `.env` e preencha:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

A `SERVICE_ROLE_KEY` fica somente no backend. Não coloque essa chave no React.

## Executar

```bash
npm install
npm run dev
```

API: `http://localhost:3000`

## Rotas principais

- `POST /usuarios/login`
- `GET/POST/PUT/DELETE /usuarios`
- `GET/POST/PUT/DELETE /alunos`
- `GET/POST/PUT/DELETE /profissionais`
- `GET/POST/PUT/DELETE /agendamentos`
- `GET/POST/PUT/DELETE /disponibilidade`
- `GET/POST /notificacoes`
