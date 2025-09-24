# Agent Guidelines for Orbital CTF

## Build/Lint/Test Commands
- **Development**: `npm run dev` (Next.js with Turbopack)
- **Build**: `npm run build` (includes Prisma generate)
- **Start**: `npm run start`
- **Lint**: `npm run lint` (ESLint with Next.js rules)
- **Database**: `npm run prisma:generate`, `npm run prisma:seed`
- **No test framework configured** - run lint after changes

## Code Style Guidelines

### TypeScript & Next.js
- **Strict TypeScript**: `strict: true` enabled, use explicit types
- **App Router**: Use `page.tsx` files in route directories
- **Client Components**: Mark with `'use client'` directive, minimize usage
- **Server Components**: Preferred for data fetching, avoid unnecessary `useState`/`useEffect`
- **Imports**: Use `@/*` path aliases, group by external/internal libraries
- **Exports**: Prefer named exports over default exports
- **Naming**: PascalCase for components, camelCase for functions/variables

### React Patterns
- **Hooks**: Use React hooks for state management
- **Error Handling**: Try/catch blocks with `console.error` for logging
- **Async Operations**: Use async/await, handle errors appropriately
- **Props**: Define interfaces for component props

### Tailwind CSS
- **Responsive**: Use `sm:`, `md:`, `lg:` prefixes for mobile-first design
- **State Variants**: `hover:`, `focus:`, `active:` for interactions
- **Patterns**: Use `@apply` in component layer for repeated styles
- **Arbitrary Values**: Use `[value]` for custom requirements when needed

### Database & API
- **Prisma**: Use for all database operations
- **API Routes**: Standard Next.js API routes with proper error responses
- **Authentication**: NextAuth.js with session handling
- **Security**: Validate inputs, use proper error status codes

### Cursor Rules
- **Next.js**: App Router structure, minimize `'use client'`, prefer server components
- **Tailwind**: Responsive prefixes, state variants, `@apply` for patterns, arbitrary values

Follow these conventions to maintain code quality and consistency.