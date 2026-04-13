"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { useState, useEffect } from "react";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableOverlay,
} from "@/components/ui/sortable";

interface ItemsProps {
  preloadedList: Preloaded<typeof api.lists.getListById>;
  clerkId: string;
  listId: string;
}

export default function Items({ preloadedList, clerkId }: ItemsProps) {
  const list = usePreloadedQuery(preloadedList);
  const clearCompletedItems = useMutation(api.items.clearCompletedItems);
  const reorderItems = useMutation(api.items.reorderItems);
  const [isClearing, setIsClearing] = useState(false);

  // Keep a local copy of items for optimistic reordering
  const [optimisticItems, setOptimisticItems] = useState<
    typeof list.items | null
  >(null);

  // Use optimistic items if available, otherwise use server items
  const items = optimisticItems ?? list?.items ?? [];

  // Reset optimistic items when server items change
  useEffect(() => {
    if (list?.items) {
      setOptimisticItems(null);
    }
  }, [list?.items]);

  if (!list || !list._id) {
    return null;
  }

  const listIdValue = list._id;
  const completedCount = items.filter((item) => item.completed).length;
  const pendingCount = items.filter((item) => !item.completed).length;

  const handleClearCompleted = async () => {
    setIsClearing(true);
    try {
      await clearCompletedItems({
        listId: listIdValue,
        clerkId,
      });
    } catch (error) {
      console.error("Failed to clear completed items:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleReorder = async (reorderedItems: typeof items) => {
    // Optimistic update
    setOptimisticItems(reorderedItems);

    try {
      await reorderItems({
        listId: listIdValue,
        clerkId,
        itemIds: reorderedItems.map((item) => item._id),
      });
    } catch (error) {
      console.error("Failed to reorder items:", error);
      // Revert optimistic update on error
      setOptimisticItems(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col">
        <h1 className="font-display text-[40px] leading-[1.0] font-medium tracking-tight text-foreground sm:text-5xl">
          {list.name}
        </h1>
        <p className="text-muted-foreground mt-5 text-[15px]">
          Add your first item to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display truncate text-[40px] leading-[1.0] font-medium tracking-tight text-foreground sm:text-5xl">
            {list.name}
          </h1>
          <div className="text-muted-foreground mt-4 flex items-center gap-3 text-[14px]">
            <span>{pendingCount} pending</span>
            <span className="text-border">•</span>
            <span>{completedCount} completed</span>
          </div>
        </div>
        <Button
          onClick={handleClearCompleted}
          disabled={isClearing || completedCount === 0}
          variant="ghost"
          size="sm"
        >
          Clear completed
        </Button>
      </div>

      {/* Sortable items list */}
      <Sortable
        value={items}
        onValueChange={handleReorder}
        getItemValue={(item) => item._id}
        orientation="vertical"
      >
        <SortableContent asChild>
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <SortableItem key={item._id} value={item._id} asHandle asChild>
                <ItemCard
                  itemId={item._id}
                  content={item.content}
                  completed={item.completed}
                  listId={listIdValue}
                  clerkId={clerkId}
                />
              </SortableItem>
            ))}
          </ul>
        </SortableContent>
        <SortableOverlay>
          {({ value }) => {
            const item = items.find((i) => i._id === value);
            if (!item) return null;
            return (
              <ItemCard
                itemId={item._id}
                content={item.content}
                completed={item.completed}
                listId={listIdValue}
                clerkId={clerkId}
                className="border-foreground/30"
              />
            );
          }}
        </SortableOverlay>
      </Sortable>
    </div>
  );
}
