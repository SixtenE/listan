import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { tryCatch } from "@/lib/utils";
import { preloadQuery } from "convex/nextjs";
import { notFound, redirect } from "next/navigation";
import Items from "./Items";
import Header from "@/components/Header";
import { auth } from "@clerk/nextjs/server";
import ItemInput from "./ItemInput";

export default async function Page({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { listId } = await params;

  const { data, error } = await tryCatch(
    preloadQuery(api.lists.getListById, {
      listId: listId as Id<"lists">,
    })
  );

  if (error) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 md:px-12">
        <Header
          clerkId={userId}
          showBackButton
          backHref="/lists"
          showAddListButton={false}
        />
        <div className="mt-8 pb-36">
          <Items preloadedList={data} clerkId={userId} listId={listId} />
        </div>
      </main>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-6 sm:pb-8">
        <div className="pointer-events-auto w-full max-w-[36rem]">
          <ItemInput clerkId={userId} listId={listId} />
        </div>
      </div>
    </div>
  );
}
