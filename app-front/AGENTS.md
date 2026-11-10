# AGENTS.md

## Visão Geral
Sistema de gestão fiscal (React + Vite). O código-fonte fica em `src/`.

## Comandos (use os scripts reais do package.json)
- Instalar dependências: `npm install`
- Rodar em desenvolvimento: `npm run dev`
- Build de produção: `npm run build`
- Rodar lint/checagem: `npm run lint` (ou o comando que você usa)

## Estrutura e Regras de Arquitetura
- **Páginas**: Ficam em `src/pages/`. Toda página deve ter o sufixo `Page` (ex: `LoginPage.jsx`).
- **Componentes de UI**: Componentes puros e reutilizáveis ficam em `src/components/ui/`.
- **Layouts**: Ficam em `src/components/layout/`.
- **API**: Todas as chamadas de rede/requisições devem ficar em `src/api/`. Nunca faça `fetch` ou `axios` diretamente dentro de um componente de página.
- **Lib**: Funções utilitárias e helpers ficam em `src/lib/`.

## Regras de Código (O que NÃO fazer)
- **Nunca** crie arquivos CSS soltos. Use apenas Tailwind CSS.
- **Nunca** use `export default` para componentes. Use exportações nomeadas (`export function ComponentName`).
- **Nunca** edite arquivos gerados automaticamente ou pastas de build (`dist/`, `node_modules/`).
- Mantenha os nomes de arquivos e variáveis em **inglês**.

## O que fazer antes de finalizar uma tarefa
- Rode o comando de lint (`npm run lint`) e corrija os erros.
- Verifique se o código novo segue o padrão de pastas descrito acima.