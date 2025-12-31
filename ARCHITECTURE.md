# Architecture Documentation

This document outlines the architectural decisions and best practices implemented in this Next.js 16 App Router application.

## Overview

This application follows Next.js 16 App Router best practices with a focus on:
- **Server Components by default** - Minimizing client-side JavaScript
- **Optimized data fetching** - Using Convex preloaded queries
- **Progressive enhancement** - Graceful loading and error states
- **Type safety** - Comprehensive TypeScript types

## Project Structure

```
/app                    # Next.js App Router pages
  /(auth)              # Route group for authentication pages
  /(landing)           # Route group for landing page
  /lists               # Lists pages
    /[listId]          # Dynamic route for individual lists
  /join/[joinId]       # Dynamic route for joining lists
/components            # React components
  /providers          # Context providers (client components)
  /ui                 # Reusable UI components
/convex               # Convex backend functions
/lib                  # Utility functions
/types                # Shared TypeScript types
/middleware.ts        # Next.js middleware for auth
```

## Key Architectural Decisions

### 1. Server Components vs Client Components

**Principle**: Use Server Components by default, only mark components as `'use client'` when necessary.

**Implementation**:
- Pages are Server Components that fetch data
- Only interactive components (forms, buttons, dialogs) are Client Components
- Navigation and static content are Server Components

**Example**: `Header` is a Server Component that renders navigation links, while `HeaderClient` handles interactive elements like `UserButton`.

### 2. Data Fetching Strategy

**Principle**: Preload data on the server for instant rendering.

**Implementation**:
- Use `preloadQuery` from Convex in Server Components
- Pass preloaded data to Client Components via props
- Client Components use `usePreloadedQuery` for instant access

**Benefits**:
- Faster initial page load
- Reduced client-side loading states
- Better SEO and social sharing

### 3. Error Handling

**Principle**: Graceful error boundaries at route level.

**Implementation**:
- `error.tsx` files for each route group
- Error boundaries catch errors and provide recovery options
- User-friendly error messages

### 4. Loading States

**Principle**: Show loading UI during data fetching.

**Implementation**:
- `loading.tsx` files for automatic loading states
- Suspense boundaries for granular loading control
- Skeleton loaders matching the final UI structure

### 5. Type Safety

**Principle**: Comprehensive TypeScript types for better DX and fewer bugs.

**Implementation**:
- Shared types in `/types` directory
- Type-safe props interfaces
- Proper typing for Convex queries and mutations

### 6. Route Prefetching

**Principle**: Prefetch routes on hover/focus for instant navigation.

**Implementation**:
- `prefetch` prop on `Link` components for important routes
- Automatic prefetching for visible links in viewport

### 7. Middleware for Auth

**Principle**: Centralized authentication logic.

**Implementation**:
- `middleware.ts` handles auth redirects
- Protects routes before rendering
- Redirects authenticated users away from auth pages

### 8. Metadata and SEO

**Principle**: Proper metadata for all pages.

**Implementation**:
- `Metadata` API for static metadata
- `generateMetadata` for dynamic metadata
- OpenGraph and Twitter card support

## Performance Optimizations

1. **Code Splitting**: Automatic via Next.js App Router
2. **Tree Shaking**: Unused code eliminated in production
3. **Image Optimization**: Configured in `next.config.ts`
4. **Package Optimization**: `optimizePackageImports` for large libraries
5. **Server Components**: Reduced client bundle size

## Data Flow

```
Server Component (Page)
  ↓ preloadQuery
  ↓ pass preloaded data
Client Component
  ↓ usePreloadedQuery
  ↓ render with data
```

## Best Practices Followed

✅ Server Components by default  
✅ Proper error boundaries  
✅ Loading states for all async operations  
✅ Type-safe code throughout  
✅ Route prefetching for better UX  
✅ Centralized auth logic  
✅ Proper metadata for SEO  
✅ Optimized bundle size  
✅ Responsive design patterns  

## Future Improvements

- [ ] Add React Server Actions for form submissions (when needed)
- [ ] Implement ISR (Incremental Static Regeneration) for public pages
- [ ] Add analytics and monitoring
- [ ] Implement proper caching strategies for static content
- [ ] Add E2E tests with Playwright
