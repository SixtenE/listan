"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, usePreloadedQuery } from "convex/react";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { useState, useMemo } from "react";
import ItemInput from "./ItemInput";
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

export default function Items({ preloadedList, clerkId, listId }: ItemsProps) {
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
  useMemo(() => {
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
      <div className="flex flex-col max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl italic text-foreground/80">
          {list.name}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Add your first item to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      {/* List header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl italic text-foreground/80">
            {list.name}
          </h1>
          <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
            <span>{pendingCount} pending</span>
            <span className="text-muted-foreground/30">•</span>
            <span>{completedCount} completed</span>
          </div>
        </div>
        <Button
          onClick={handleClearCompleted}
          disabled={isClearing || completedCount === 0}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          clear completed
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
          <ul className="flex flex-col gap-3">
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
                className="shadow-lg"
              />
            );
          }}
        </SortableOverlay>
      </Sortable>
    </div>
  );
}
