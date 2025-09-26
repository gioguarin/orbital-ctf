# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- **Development**: `npm run dev` (Next.js with Turbopack enabled)
- **Build**: `npm run build` (includes Prisma client generation)
- **Start**: `npm start` (production server)
- **Lint**: `npm run lint` (ESLint with Next.js rules)

### Database Commands
- **Generate Prisma Client**: `npm run prisma:generate` or `npx prisma generate`
- **Database Reset**: `npx prisma migrate reset`
- **Seed Database**: `npm run prisma:seed`

### Testing
- **No test framework configured** - Always run `npm run lint` after making changes
- Manual testing recommended for API endpoints and UI components

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Prisma with SQLite (configurable via DATABASE_URL)
- **Authentication**: NextAuth.js with custom session handling
- **Styling**: Tailwind CSS with retro space theme
- **UI Components**: Custom components with react-icons
- **Real-time**: React hot-toast for notifications

### Key Directories
```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints for CTF functionality
│   └── [pages]/           # Page components and layouts
├── components/            # Reusable React components
├── lib/                   # Server-side utilities and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client instance
│   ├── challenges.ts     # Challenge management utilities
│   └── challenge-ingestion.ts # Challenge import functionality
├── utils/                 # Client-side utilities
├── types/                 # Shared TypeScript type definitions
└── middleware.ts          # Next.js middleware for route protection
```

### Database Architecture
The platform uses Prisma with a comprehensive schema supporting:
- **User/Team Management**: User accounts, team formation, roles
- **Challenge System**: Multi-flag challenges, categories, difficulty levels
- **Scoring & Progress**: Real-time scoring, point history, leaderboards
- **Game Management**: Time-based unlocks, game configuration, announcements
- **Security Features**: Activity logging, submission tracking, hint system

### Core Library Files
- **`src/lib/auth.ts`**: NextAuth.js configuration with custom authentication
- **`src/lib/prisma.ts`**: Prisma client with connection management
- **`src/lib/challenges.ts`**: Challenge CRUD operations and validation
- **`src/lib/challenge-ingestion.ts`**: Automatic challenge import from filesystem

## Development Patterns

### Next.js App Router
- Use **Server Components** by default for better performance
- Mark components with `'use client'` only when necessary (hooks, browser APIs)
- API routes follow standard Next.js patterns in `src/app/api/`
- Use `@/` path alias for imports

### Database Operations
- Always use Prisma client from `src/lib/prisma.ts`
- Follow the established schema relationships
- Handle database errors with appropriate HTTP status codes
- Use transactions for complex operations

### Authentication & Authorization
- NextAuth.js handles session management
- Admin routes require `isAdmin` check
- Team operations validate team membership
- API routes include proper authentication middleware

### Component Development
- Follow existing component patterns and styling
- Use Tailwind CSS with the established design system
- Maintain the retro space theme consistency
- Implement responsive design with mobile-first approach

### Code Style (from AGENTS.md)
- **TypeScript**: Strict mode enabled, explicit types preferred
- **React**: Use hooks, proper error handling with try/catch
- **Imports**: Group external/internal, use `@/` aliases
- **Naming**: PascalCase for components, camelCase for functions
- **Exports**: Prefer named exports over default exports

## CTF-Specific Features

### Challenge Management
- Challenges auto-imported from `challenges/` directory on startup
- Support for multi-flag challenges with partial scoring
- Time-based and prerequisite-based unlock conditions
- File attachments and hints with point costs

### Scoring System
- Real-time leaderboard updates
- Individual and team scoring
- Point history tracking with detailed metadata
- Activity logging for all team actions

### Game Configuration
- Configurable start/end times via environment variables
- Admin panel for game management
- Announcement system for real-time communication
- Challenge category and difficulty management

## Environment Configuration

### Required Variables
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Optional Variables
```env
INGEST_CHALLENGES_AT_STARTUP=true
CHALLENGES_DIR="./challenges"
GAME_START_TIME="2025-01-15T18:00:00.000Z"
GAME_END_TIME="2025-01-15T22:00:00.000Z"
```

## Deployment

### Production Build
1. Run `npm run build` to generate optimized build
2. Ensure database migrations are up to date
3. Set production environment variables
4. Use `npm start` for production server

### Docker Deployment
- `Dockerfile` and `docker-compose.yml` provided
- See `deploy-docker.sh` for automated Docker deployment
- See `deploy-linode.sh` for cloud deployment

## Security Considerations
- Never commit secrets or API keys
- Validate all user inputs in API routes
- Use proper HTTP status codes for errors
- Implement rate limiting where appropriate
- Sanitize file uploads and challenge content