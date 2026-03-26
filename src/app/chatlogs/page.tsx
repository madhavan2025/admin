import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ChatLogs from "@/components/ChatLogs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chatlogs | Your Dashboard",
  description: "View chat history of your users",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { customerId?: string };
}) {
  const customerId = (await searchParams)?.customerId ?? null;

  return (
    <>
      <Breadcrumb pageName="Chat Logs" />

      <div className="space-y-7.5 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:p-6 xl:p-9">
        <div className="w-full">
          <ChatLogs customerId={customerId} />
        </div>
      </div>

      
    </>
  );
}