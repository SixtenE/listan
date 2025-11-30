import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const get = query({
    args: {
        clerkId: v.string(),
    },
    handler: async (ctx, { clerkId }) => {
        const memberships = await ctx.db
            .query('members')
            .withIndex('by_clerkId_listId', (q) => q.eq('clerkId', clerkId))
            .collect()

        const lists = await Promise.all(
            memberships.map(async (membership) => await ctx.db.get(membership.listId)),
        )

        return lists.filter((list) => list !== null)
    },
})

export const add = mutation({
  args: {
    name: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, { name, clerkId }) => {
    
    const listId = await ctx.db.insert('lists', { name })

    await ctx.db.insert('members', {
      clerkId,
      listId,
    })

    return listId
  }
})

export const getById = query({
  args: {
    listId: v.id('lists'),
  },
  handler: async (ctx, { listId }) => {
    const list = await ctx.db.get(listId)
    return {
        ...list,
        items: await ctx.db
            .query('items')
            .withIndex('by_listId', (q) => q.eq('listId', listId))
            .collect(),
    }
  },
})
