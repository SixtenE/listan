import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  lists: defineTable({
    name: v.string(),
  }),
  members: defineTable({
    clerkId: v.string(),
    listId: v.id('lists'),
  }).index('by_clerkId_listId', ['clerkId', 'listId']),
  items: defineTable({
    content: v.string(),
    listId: v.id('lists'),
  }).index('by_listId', ['listId']),
})
