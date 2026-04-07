"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      
      {/* Main Wrapper: 
          Using 'gap-3' as the base for mobile to keep Hamburger, Search, and Icons 
          perfectly aligned with the same spacing.
      */}
     <div className="flex w-full items-center justify-between">

  {/* 🔹 LEFT: Hamburger + Search (Mobile) */}
  <div className="flex items-center gap-3">

    {/* Hamburger */}
    <button
      onClick={toggleSidebar}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
    >
      <MenuIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </button>

    {/* 🔹 Mobile Search Button (MOVED HERE) */}
    

    {/* Logo */}
    {isMobile && (
      <Link href={"/"} className="shrink-0 hidden sm:block lg:hidden">
        <Image
          src={"/images/logo/logo-icon.svg"}
          width={32}
          height={32}
          alt="Logo"
        />
      </Link>
    )}

    <div className="hidden xl:block">
      <h1 className="text-heading-5 font-bold text-dark dark:text-white">
        Dashboard
      </h1>
    </div>
  </div>

  {/* 🔹 RIGHT: Desktop Search + Icons */}
  <div className="flex items-center gap-3 md:gap-4">

    {/* Desktop Search */}
    <div className="relative hidden sm:block w-[250px] md:w-[300px]">
      <input
        type="search"
        placeholder="Search"
        className="h-11 w-full rounded-full border bg-gray-2 py-3 pl-10 pr-2 outline-none transition-all focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 sm:pl-[53px] sm:pr-5"
      />
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 sm:left-5" />
    </div>

    <button
      className="flex items-center justify-center h-10 w-10 rounded-full border bg-gray-2 dark:border-dark-3 dark:bg-dark-2 sm:hidden"
      aria-label="Open search"
    >
      <SearchIcon className="size-5" />
    </button>

    {/* Icons */}
    <div className="flex items-center gap-3 md:gap-4">
      <ThemeToggleSwitch />
      <Notification />
      <UserInfo />
    </div>
  </div>
</div>
    </header>
  );
}