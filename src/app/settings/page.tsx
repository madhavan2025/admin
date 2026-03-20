import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import *as Icons from "@/components/Layouts/sidebar/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Your Dashboard Name",
  description: "Manage your application settings",
};

export default function SettingsPage() {
  return (
    <>
      <Breadcrumb pageName="Settings" />

      {/* Container styled same as your other pages */}
      <div className="space-y-7.5 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:p-6 xl:p-9">
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Agent Settings Card */}
          <Link href="/agent-settings">
            <div className="flex items-start gap-4 rounded-xl border border-stroke p-6 hover:shadow-lg hover:-translate-y-1 transition-all dark:border-dark-3 cursor-pointer">
              
              <div className="rounded-lg bg-primary/10 p-3">
                <Icons.AgentIcon className="text-primary" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dark dark:text-white">
                  Agent Settings
                </h3>
                <p className="text-sm text-body-color">
                  Configure agent behavior, prompts, and AI responses.
                </p>
              </div>
            </div>
          </Link>

          {/* Client Settings Card */}
          <Link href="/client-settings">
            <div className="flex items-start gap-4 rounded-xl border border-stroke p-6 hover:shadow-lg hover:-translate-y-1 transition-all dark:border-dark-3 cursor-pointer">
              
              <div className="rounded-lg bg-primary/10 p-3">
                <Icons.ClientIcon className="text-primary" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dark dark:text-white">
                  Client Settings
                </h3>
                <p className="text-sm text-body-color">
                  Manage client preferences and configuration options.
                </p>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </>
  );
}