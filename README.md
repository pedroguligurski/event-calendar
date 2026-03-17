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
