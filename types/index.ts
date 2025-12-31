/**
 * Shared TypeScript types and interfaces for the application.
 * Centralized type definitions for better maintainability and consistency.
 */

import { Id } from '@/convex/_generated/dataModel'
import { Preloaded } from 'convex/react'
import { api } from '@/convex/_generated/api'

/**
 * Props for components that require a Clerk user ID
 */
export interface ClerkIdProps {
  /** The Clerk user ID of the current user */
  clerkId: string
}

/**
 * Props for list-related components
 */
export interface ListProps extends ClerkIdProps {
  /** The unique identifier of the list */
  listId: Id<'lists'>
}

/**
 * Preloaded query types for type safety
 */
export type PreloadedLists = Preloaded<typeof api.lists.getListsByUser>
export type PreloadedList = Preloaded<typeof api.lists.getListById>

/**
 * Common component props patterns
 */
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Navigation-related types
 */
export interface NavigationProps {
  showBackButton?: boolean
  backHref?: string
  showAddListButton?: boolean
}
