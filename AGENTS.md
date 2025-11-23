# Agent Guidelines for Marketeers

## Commands
- **Build**: `bun run build`
- **Dev server**: `bun run dev` I MUST NEVER RUN THIS. THIS WILL KILL THE USER
- **Test all**: `bun run test`
- **Test single**: `vitest run --reporter=verbose path/to/test.ts`
- **Lint**: `bun run lint`
- **Format**: `bun run format`
- **Type check**: `bun run check`
- **Database**: `bun run db:generate`, `bun run db:migrate`, `bun run db:push` I MUST NEVER RUN THIS. I SHOULD PROMPTY THE USER TO DO SO
- **i18n**: `bun run i18n:generate`

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

## Campaign Feature

### Overview
The application now supports campaign management, allowing users to organize their social media posts into campaigns. Users can create multiple campaigns, switch between them, and have a default "Default" campaign created automatically.

### Database Schema
- **campaigns table**: `id`, `userId`, `name`, `description`, `isDefault`, `createdAt`, `updatedAt`
- **posts table**: Added `campaignId` foreign key referencing campaigns.id

### Key Components
- `CampaignSelectorModal`: Modal for selecting/creating campaigns
- `useCampaigns`: Hook for managing campaign data
- `useCurrentCampaign`: Hook for getting the active campaign

### API Endpoints
- `GET /api/campaigns`: List user campaigns
- `POST /api/campaigns`: Create new campaign
- `PUT /api/campaigns?id=<id>`: Update campaign
- `DELETE /api/campaigns?id=<id>`: Delete campaign

### Database Migration
Run `bun run db:migrate` to apply the campaign schema changes.

### Default Campaign Creation
New users automatically get a "Default" campaign created when they first access the dashboard.

### Post Filtering
Posts are now filtered by the current campaign in the dashboard timeline.
