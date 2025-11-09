import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const get = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query('items').order('desc').collect()
    return items
  },
})

export const add = mutation({
  args: { content: v.string(), listId: v.id('lists') },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('items', {
      content: args.content,
      listId: args.listId,
    })
    return id
  },
})
