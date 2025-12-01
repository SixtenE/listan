import { internal } from './_generated/api'
import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const add = mutation({
  args: {
    content: v.string(),
    listId: v.id('lists'),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const isMember = await ctx.db
      .query('members')
      .withIndex('by_clerkId_listId', (q) =>
        q.eq('clerkId', args.clerkId).eq('listId', args.listId),
      )
      .first()

    if (!isMember) {
      throw new Error('You are not a member of this list.')
    }

    const id = await ctx.db.insert('items', {
      content: args.content,
      listId: args.listId,
      completed: false,
    })

    await ctx.runMutation(internal.lists.updateUpdatedAt, {
      listId: args.listId,
    })

    return id
  },
})

export const editItem = mutation({
  args: {
    itemId: v.id('items'),
    content: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId)

    if (!item) {
      throw new Error('Item not found')
    }

    const isMember = await ctx.db
      .query('members')
      .withIndex('by_clerkId_listId', (q) =>
        q.eq('clerkId', args.clerkId).eq('listId', item.listId),
      )
      .first()

    if (!isMember) {
      throw new Error('You are not a member of this list.')
    }

    await ctx.db.patch(args.itemId, {
      content: args.content,
    })

    await ctx.runMutation(internal.lists.updateUpdatedAt, {
      listId: item.listId,
    })
  },
})

export const toggleCompleted = mutation({
  args: {
    itemId: v.id('items'),
    completed: v.boolean(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId)

    if (!item) {
      throw new Error('Item not found')
    }

    const isMember = await ctx.db
      .query('members')
      .withIndex('by_clerkId_listId', (q) =>
        q.eq('clerkId', args.clerkId).eq('listId', item.listId),
      )
      .first()

    if (!isMember) {
      throw new Error('You are not a member of this list.')
    }

    await ctx.db.patch(args.itemId, {
      completed: args.completed,
    })

    await ctx.runMutation(internal.lists.updateUpdatedAt, {
      listId: item.listId,
    })
  },
})

export const remove = mutation({
  args: {
    itemId: v.id('items'),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId)

    if (!item) {
      throw new Error('Item not found')
    }

    const isMember = await ctx.db
      .query('members')
      .withIndex('by_clerkId_listId', (q) =>
        q.eq('clerkId', args.clerkId).eq('listId', item.listId),
      )
      .first()

    if (!isMember) {
      throw new Error('You are not a member of this list.')
    }

    await ctx.db.delete(item._id)

    await ctx.runMutation(internal.lists.updateUpdatedAt, {
      listId: item.listId,
    })
  },
})

export const clearCompleted = mutation({
  args: {
    listId: v.id('lists'),
    clerkId: v.string(),
  },
  handler: async (ctx, { listId, clerkId }) => {
    const isMember = await ctx.db
      .query('members')
      .withIndex('by_clerkId_listId', (q) =>
        q.eq('clerkId', clerkId).eq('listId', listId),
      )
      .first()

    if (!isMember) {
      throw new Error('You are not a member of this list.')
    }

    const completedItems = await ctx.db
      .query('items')
      .withIndex('by_listId_completed', (q) =>
        q.eq('listId', listId).eq('completed', true),
      )
      .collect()

    for (const item of completedItems) {
      await ctx.db.delete(item._id)
    }

    await ctx.runMutation(internal.lists.updateUpdatedAt, {
      listId: listId,
    })

    return completedItems.length
  },
})
