"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, FormEvent } from "react";

interface ItemInputProps {
  clerkId: string;
  listId: string;
}

export default function ItemInput({ clerkId, listId }: ItemInputProps) {
  const addItem = useMutation(api.items.createItem);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addItem({
        clerkId,
        listId: listId as Id<"lists">,
        content: trimmedContent,
      });
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="group flex w-full items-center gap-2 rounded-full border border-border bg-background py-1.5 pr-1.5 pl-5 transition-colors duration-150 ease-out focus-within:border-foreground/30 sm:w-[36rem]"
    >
      <input
        type="text"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add an item..."
        className="placeholder:text-muted-foreground flex-1 bg-transparent text-[16px] outline-none sm:text-[15px]"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
          }
        }}
      />
      <Button
        type="submit"
        size="icon-sm"
        disabled={!content.trim() || isSubmitting}
        aria-label="Add item"
      >
        <Plus />
      </Button>
    </form>
  );
}
