import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  lists: defineTable({
    name: v.string(),
    updatedAt: v.number(),
  }),
  members: defineTable({
    clerkId: v.string(),
    listId: v.id('lists'),
    role: v.union(v.literal('owner'), v.literal('member')),
  })
    .index('by_clerkId_listId', ['clerkId', 'listId'])
    .index('by_listId_role', ['listId', 'role'])
    .index('by_listId', ['listId']),
  items: defineTable({
    content: v.string(),
    listId: v.id('lists'),
    completed: v.boolean(),
  })
    .index('by_listId', ['listId'])
    .index('by_listId_completed', ['listId', 'completed']),
})
