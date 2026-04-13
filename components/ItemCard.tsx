"use client";

import ItemActions from "@/app/lists/[listId]/ItemActions";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Check } from "lucide-react";
import { useState, useEffect, useRef, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ItemCardProps extends React.ComponentPropsWithoutRef<"li"> {
  itemId: Id<"items">;
  content: string;
  completed: boolean;
  listId: Id<"lists">;
  clerkId: string;
}

const ItemCard = forwardRef<HTMLLIElement, ItemCardProps>(function ItemCard(
  { itemId, content, completed, listId, clerkId, className, ...props },
  ref
) {
  const toggleCompleted = useMutation(api.items.toggleItemCompleted);
  const [optimisticCompleted, setOptimisticCompleted] = useState(completed);
  const isPendingRef = useRef(false);

  useEffect(() => {
    if (!isPendingRef.current) {
      setOptimisticCompleted(completed);
    }
  }, [completed]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const newCompleted = !optimisticCompleted;

    isPendingRef.current = true;
    setOptimisticCompleted(newCompleted);

    try {
      await toggleCompleted({
        itemId,
        completed: newCompleted,
        clerkId,
      });
    } catch (error) {
      setOptimisticCompleted(!newCompleted);
      console.error("Failed to toggle item:", error);
    } finally {
      setTimeout(() => {
        isPendingRef.current = false;
      }, 100);
    }
  };

  const displayCompleted = optimisticCompleted;

  return (
    <li
      ref={ref}
      className={cn(
        "group relative flex w-full items-center gap-4 rounded-xl border border-border bg-background px-5 py-4 transition-colors duration-150 ease-out hover:border-foreground/30",
        displayCompleted && "bg-muted border-transparent hover:border-border",
        className
      )}
      {...props}
    >
      <button
        type="button"
        onClick={handleToggle}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className={cn(
          "relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-150 ease-out touch-none active:scale-[0.92]",
          displayCompleted
            ? "border-foreground bg-foreground text-background"
            : "border-border hover:border-foreground"
        )}
        aria-label={
          displayCompleted ? "Mark as incomplete" : "Mark as complete"
        }
      >
        {displayCompleted && <Check className="size-3" strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-[15px] leading-snug break-words transition-opacity duration-150 ease-out",
            displayCompleted
              ? "text-muted-foreground line-through opacity-60"
              : "text-foreground"
          )}
        >
          {content}
        </p>
      </div>
      <div
        className="relative z-10 touch-none"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <ItemActions
          itemId={itemId}
          listId={listId}
          clerkId={clerkId}
          initialContent={content}
        />
      </div>
    </li>
  );
});

export default ItemCard;
