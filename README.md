# Eventos Monorepo

Monorepo para sistema de divulgação de eventos.

## Estrutura

```
eventos-monorepo/
├── package.json          # Raiz do workspace
├── tsconfig.base.json    # TypeScript base compartilhado
├── .gitignore
└── packages/
    ├── backend/          # Node.js + TypeScript + Express
    │   ├── src/
    │   │   └── index.ts
    │   ├── package.json
    │   └── tsconfig.json
    └── frontend/         # Vue 3 + Vite + Pinia + Vue Router
        ├── src/
        │   ├── views/
        │   ├── router/
        │   ├── stores/
        │   ├── components/
        │   ├── App.vue
        │   └── main.ts
        ├── index.html
        ├── vite.config.ts
        ├── package.json
        └── tsconfig.json
```

## Instalação

```bash
npm install
```

## Desenvolvimento

Rodar tudo junto:

```bash
npm run dev
```

Ou separado:

```bash
npm run dev -w backend    # http://localhost:3000
npm run dev -w frontend   # http://localhost:5173
```

## Build

```bash
npm run build
```

## Variaveis de ambiente (backend)

Defina as variaveis abaixo para o fluxo de autenticacao funcionar corretamente:

```bash
JWT_SECRET=seu_jwt_secret
MAGIC_LINK_SECRET=seu_magic_link_secret
FRONTEND_URL=http://localhost:5173
JWT_EXPIRES_IN=7d
MAGIC_LINK_EXPIRES_IN=15m

# SMTP (obrigatorio em producao)
MAIL_FROM=no-reply@cwb-connect.local
SMTP_HOST=smtp.seudominio.com
SMTP_PORT=587
SMTP_USER=usuario_smtp
SMTP_PASS=senha_smtp
SMTP_SECURE=false
```

Em desenvolvimento, se SMTP nao estiver configurado, o endpoint de magic link retorna o link na resposta para facilitar testes.
