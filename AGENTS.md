# Agent Guidelines for Marketeers

## Commands
- **Build**: `bun run build`
- **Dev server**: `bun run dev`
- **Test all**: `bun run test`
- **Test single**: `vitest run --reporter=verbose path/to/test.ts`
- **Lint**: `bun run lint`
- **Format**: `bun run format`
- **Type check**: `bun run check`

## Code Style
- **Formatting**: Biome with tabs, double quotes, auto-organize imports
- **TypeScript**: Strict mode, no unused locals/parameters, path aliases `@/*`
- **Components**: Shadcn/ui with class-variance-authority, Tailwind CSS
- **Imports**: Group external libs first, then internal with `@/` aliases
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Error handling**: Use try/catch for async operations, throw descriptive errors
- **File structure**: Feature-based organization under `src/`

## Cursor Rules
- Use `bunx shadcn@latest add component-name` for new Shadcn components

## Libraries
- React 19, TanStack Router/Query, Drizzle ORM, Radix UI, Tailwind CSS
