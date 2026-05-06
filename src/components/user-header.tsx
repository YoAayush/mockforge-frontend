"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MouseEventHandler } from "react";
import {
  BookOpen,
  Code2,
  HelpCircle,
  Laptop,
  Moon,
  Plus,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
  };
  userName: string;
  logout: MouseEventHandler<HTMLButtonElement>;
}

export function Header({
  title,
  subtitle,
  action,
  userName,
  logout,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };
  return (
    <div>
      <header className="border-b border-border backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full mx-auto px-12 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-primary text-lg"
          >
            <span className="text-blue-400">&lt;/&gt;</span>
            MockForge
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg border border-default text-secondary hover:text-primary hover:bg-[rgb(var(--bg-tertiary))] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" && <Sun size={20} />}
              {theme === "dark" && <Moon size={20} />}
              {theme === "system" && <Laptop size={20} />}
            </button>
            <Link
              href="/usage"
              className="text-secondary hover:text-slate-200 transition-colors text-sm flex items-center gap-1.5"
            >
              <BookOpen className="h-4 w-4" />
              Usage
            </Link>
            <Link
              href="/documentation"
              className="text-secondary hover:text-slate-200 transition-colors text-sm flex items-center gap-1.5"
            >
              <HelpCircle className="h-4 w-4" />
              Documentation
            </Link>
            <div className="w-px h-4 bg-slate-400"></div>
            <div className="flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors cursor-pointer">
              <User className="w-4 h-4" />
              <span>Aayush Chopra</span>
            </div>
            <button
              className="text-sm text-[rgb(var(--text-secondary))] hover:text-red-500 transition-colors font-medium cursor-pointer"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto pt-8 px-12">
        {/* Page Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              My Projects
            </h1>
            <p className="text-secondary text-lg">
              Create and manage your mock API projects
            </p>
          </div>
          {action && (
            <Button
              className="gap-2 bg-secondary hover:bg-slate-100 text-secondary font-semibold px-6 py-2 rounded-lg"
              onClick={action.onClick}
            >
              <Plus className="w-5 h-5" />
              New Project
            </Button>
          )}
        </div>
      </main>
    </div>

    // <div className="border-b border-slate-800 px-8 py-6">
    //     <div className="flex items-center justify-between px-8 py-6">
    //         <Link href="/" className="flex items-center gap-2">
    //             <div className="text-sm font-mono text-neutral-400">{"</>"}</div>
    //             <span className="text-lg font-semibold text-white">MockForge</span>
    //         </Link>
    //         <div className="flex items-center gap-4">
    //             <span className="text-sm text-neutral-400">{userName}</span>
    //             <Button variant="ghost" size="sm" className="text-neutral-400" onClick={logout}>
    //                 Logout
    //             </Button>
    //         </div>
    //     </div>
    //     <div className="flex items-center justify-between">
    //         <div>
    //             <h1 className="text-3xl font-bold mb-2">My Projects</h1>
    //             <p className="text-slate-400">Create and manage your mock API projects</p>
    //         </div>
    //         <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">
    //             <Plus className="h-4 w-4" />
    //             New Project
    //         </button>
    //     </div>
    // </div>

    // <div className="border-b border-neutral-800 bg-neutral-950">
    //     <div className="flex items-center justify-between px-8 py-6">
    //         <Link href="/" className="flex items-center gap-2">
    //             <div className="text-sm font-mono text-neutral-400">{"</>"}</div>
    //             <span className="text-lg font-semibold text-white">MockForge</span>
    //         </Link>
    //         <div className="flex items-center gap-4">
    //             <span className="text-sm text-neutral-400">{userName}</span>
    //             <Button variant="ghost" size="sm" className="text-neutral-400" onClick={logout}>
    //                 Logout
    //             </Button>
    //         </div>
    //     </div>
    //     {title && (
    //         <div className="border-t border-neutral-800 px-8 py-6">
    //             <div className="flex items-center justify-between">
    //                 <div>
    //                     <h1 className="text-2xl font-bold text-white">{title}</h1>
    //                     {subtitle && <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>}
    //                 </div>
    //                 {action && (
    //                     <Button onClick={action.onClick} className="bg-white text-black hover:bg-neutral-100">
    //                         {action.label}
    //                     </Button>
    //                 )}
    //             </div>
    //         </div>
    //     )}
    // </div>
  );
}
