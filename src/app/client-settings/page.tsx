import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ClientSettings from "@/components/ClientSettings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Settings | Your Dashboard Name",
  description: "Configure your AI Agent appearance and behavior",
};

export default function Page() {
  return (
    <>
      <Breadcrumb pageName="Client Settings" />

      {/* This div uses the exact classes from your reference for consistency */}
      <div className="space-y-7.5 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:p-6 xl:p-9">
        <div className="max-w-2xl">
           <ClientSettings />
        </div>
      </div>
    </>
  );
}