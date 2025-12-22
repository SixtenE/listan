import { v } from 'convex/values'
import { internalMutation, mutation, query } from './_generated/server'
import { api } from './_generated/api'

export const getListsByUser = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    const memberships = await ctx.db
      .query('members')
      .withIndex('by_clerkId_listId', (q) => q.eq('clerkId', clerkId))
      .collect()

    const lists = await Promise.all(
      memberships.map(
        async (membership) => await ctx.db.get(membership.listId),
      ),
    )

    return lists
      .filter((list) => list !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt)
  },
})

export const createList = mutation({
  args: {
    name: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, { name, clerkId }) => {
    const createdListAmount = await ctx.db
      .query('members')
      .withIndex('by_clerkId_listId', (q) => q.eq('clerkId', clerkId))
      .collect()

    if (createdListAmount.length >= 3) {
      throw new Error('You have reached the limit of 3 created lists.')
    }

    const listId = await ctx.db.insert('lists', { name, updatedAt: Date.now() })

    await ctx.db.insert('members', {
      clerkId,
      listId,
      role: 'owner',
    })

    return listId
  },
})

export const getListById = query({
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

export const isListOwner = query({
  args: {
    listId: v.id('lists'),
    clerkId: v.string(),
  },
  handler: async (ctx, { listId, clerkId }) => {
    const membership = await ctx.db
      .query('members')
      .withIndex('by_clerkId_listId', (q) =>
        q.eq('clerkId', clerkId).eq('listId', listId),
      )
      .first()

    return membership?.role === 'owner'
  },
})

export const renameList = mutation({
  args: {
    listId: v.id('lists'),
    newName: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, { listId, newName, clerkId }) => {
    const isListOwner = await ctx.runQuery(api.lists.isListOwner, {
      listId,
      clerkId,
    })

    if (!isListOwner) {
      throw new Error('Only owners can rename the list')
    }

    await ctx.db.patch(listId, { name: newName })
  },
})

export const deleteList = mutation({
  args: {
    listId: v.id('lists'),
    clerkId: v.string(),
  },
  handler: async (ctx, { listId, clerkId }) => {
    const isOwner = await ctx.db
      .query('members')
      .withIndex('by_listId_role', (q) =>
        q.eq('listId', listId).eq('role', 'owner'),
      )
      .first()

    if (!isOwner || isOwner.clerkId !== clerkId) {
      throw new Error('Only owners can delete the list')
    }

    // Delete all memberships
    const memberships = await ctx.db
      .query('members')
      .withIndex('by_listId', (q) => q.eq('listId', listId))
      .collect()

    for (const membership of memberships) {
      await ctx.db.delete(membership._id)
    }

    // Delete all items
    const items = await ctx.db
      .query('items')
      .withIndex('by_listId', (q) => q.eq('listId', listId))
      .collect()

    for (const item of items) {
      await ctx.db.delete(item._id)
    }

    // Delete the list
    await ctx.db.delete(listId)
  },
})

export const joinList = mutation({
  args: {
    listId: v.id('lists'),
    clerkId: v.string(),
  },
  handler: async (ctx, { listId, clerkId }) => {
    const existingMembership = await ctx.db
      .query('members')
      .withIndex('by_clerkId_listId', (q) =>
        q.eq('clerkId', clerkId).eq('listId', listId),
      )
      .first()

    if (existingMembership) {
      throw new Error('User is already a member of the list')
    }

    await ctx.db.insert('members', {
      clerkId,
      listId,
      role: 'member',
    })
  },
})

export const leaveList = mutation({
  args: {
    listId: v.id('lists'),
    clerkId: v.string(),
  },
  handler: async (ctx, { listId, clerkId }) => {
    const membership = await ctx.db
      .query('members')
      .withIndex('by_clerkId_listId', (q) =>
        q.eq('clerkId', clerkId).eq('listId', listId),
      )
      .first()

    if (!membership) {
      throw new Error('Membership not found')
    }

    if (membership.role === 'owner') {
      throw new Error('Owners cannot leave the list')
    }

    await ctx.db.delete(membership._id)
  },
})

export const updateListTimestamp = internalMutation({
  args: {
    listId: v.id('lists'),
  },
  handler: async (ctx, { listId }) => {
    await ctx.db.patch(listId, { updatedAt: Date.now() })
  },
})
