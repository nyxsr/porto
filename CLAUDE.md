# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio website built with Next.js 15, TypeScript, and Drizzle ORM. Uses Neon PostgreSQL for database, OpenAI for AI features, and includes interactive 3D elements with Three.js.

## Development Commands

### Package Manager
This project uses **Bun** as the package manager (note: bun.lock file present).

### Core Commands
```bash
bun dev          # Start development server with Turbopack
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint checks
```

### Database Commands
```bash
bun db:studio    # Open Drizzle Studio (GUI for database)
bun db:generate  # Generate migrations from schema changes
bun db:migrate   # Run pending migrations
bun db:push      # Push schema changes directly to database
bun db:pull      # Pull database schema
bun db:check     # Check migration validity
bun db:up        # Update database schema
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript with strict mode
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS v4 with custom utilities
- **UI Components**: Radix UI primitives with custom components
- **Animation**: GSAP, Motion, Lenis for smooth scrolling
- **3D Graphics**: Three.js with React Three Fiber
- **State Management**: Zustand
- **AI Integration**: OpenAI API for chat features and embeddings

### Project Structure
- `/src/app` - Next.js App Router pages and API routes
  - `(core)` - Main application pages with sidebar layout
  - `api/chat/stream` - AI chat streaming endpoint with RAG implementation
- `/src/db` - Database configuration and schemas
  - `schemas/` - Drizzle schema definitions (convo, knowledge)
  - Seeds and migration scripts
- `/src/lib` - Core utilities and integrations
  - AI-related: `openai.ts`, `embedding.ts`, `retrieve.ts`, `chat-store.ts`
  - Utils: `utils.ts` (cn helper, random generators)
- `/src/components/ui` - Reusable UI components
- `/src/constants` - Application constants
- `/src/store` - Zustand stores (company.store.ts)
- `/drizzle` - Database migrations

### Key Architectural Patterns

1. **RAG (Retrieval-Augmented Generation) System**
   - Embeddings stored in knowledge table with vector search
   - Three response modes: grounded (strict), merge (flexible), general
   - Similarity thresholds: STRICT_MIN and MERGE_MIN control behavior

2. **Database Schema**
   - Knowledge base with embeddings, metadata, and slugs
   - Conversation history tracking with session management
   - PostgreSQL with vector similarity search capabilities

3. **Component Architecture**
   - Server components by default in App Router
   - Client components for interactive elements (Three.js, animations)
   - Shared UI components using CVA for variant management

## Code Style

### Formatting (Prettier)
- Single quotes, semicolons, trailing commas
- 2-space indentation, 100-char line width
- Import sorting with grouped categories
- Tailwind class sorting enabled

### Import Order
1. React imports
2. Next.js imports
3. Third-party modules
4. Empty line
5. Internal imports by category (@/types, @/config, @/lib, etc.)
6. Relative imports

### TypeScript
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Target ES2017

## Environment Variables
Required in `.env.local`:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `OPENAPI_API_KEY` - OpenAI API key (note: typo in env.d.ts)
- `STRICT_MIN` - Similarity threshold for strict mode
- `MERGE_MIN` - Similarity threshold for merge mode

## Edge Runtime
API routes use Edge Runtime for better performance with streaming responses.