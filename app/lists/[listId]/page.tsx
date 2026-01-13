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
    <div className="flex min-h-screen flex-col font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 md:px-12">
        <Header
          clerkId={userId}
          showBackButton
          backHref="/lists"
          showAddListButton={false}
        />
        <div className="pb-20 mt-8">
          <Items preloadedList={data} clerkId={userId} listId={listId} />
          {/* Item input */}
          <div className="fixed flex justify-center bottom-0 pb-8 px-2 left-0 right-0">
            <ItemInput clerkId={userId} listId={listId} />
          </div>
        </div>
      </main>
    </div>
  );
}
