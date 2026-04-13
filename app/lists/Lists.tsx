"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import ListCard from "@/components/ListCard";
import AddListDialog from "@/components/AddListDialog";
import { motion } from "motion/react";

const easeOut = [0.23, 1, 0.32, 1] as const;

interface ListsProps {
  preloadedLists: Preloaded<typeof api.lists.getListsByUser>;
  clerkId: string;
}

export default function Lists({ preloadedLists, clerkId }: ListsProps) {
  const lists = usePreloadedQuery(preloadedLists);

  if (lists.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-start pt-16 sm:pt-24">
        <h1 className="font-display text-[44px] leading-[1.0] font-medium tracking-tight text-foreground sm:text-6xl">
          Your lists
        </h1>
        <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">
          Nothing here yet. Start your first list — it only takes a second.
        </p>
        <div className="mt-10">
          <AddListDialog clerkId={clerkId} />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 sm:pt-12">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-[26px] leading-[1.1] font-medium tracking-tight text-foreground sm:text-[32px]">
            Your lists
          </h1>
          <span className="text-muted-foreground text-[14px]">
            {lists.length} {lists.length === 1 ? "list" : "lists"}
          </span>
        </div>
        <AddListDialog clerkId={clerkId} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {lists.map((list, index) => (
          <motion.div
            key={list._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: easeOut }}
          >
            <ListCard
              listId={list._id}
              name={list.name}
              updatedAt={list.updatedAt}
              pendingCount={list.pendingCount}
              completedCount={list.completedCount}
              memberCount={list.memberCount}
              clerkId={clerkId}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
