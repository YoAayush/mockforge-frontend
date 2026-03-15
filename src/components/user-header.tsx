"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MouseEventHandler } from "react";

interface HeaderProps {
    title?: string;
    subtitle?: string;
    action?: {
        label: string;
        onClick: MouseEventHandler<HTMLButtonElement>;
    };
    logout: MouseEventHandler<HTMLButtonElement>;
}

export function Header({ title, subtitle, action, logout }: HeaderProps) {
    return (
        <div className="border-b border-neutral-800 bg-neutral-950">
            <div className="flex items-center justify-between px-8 py-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="text-sm font-mono text-neutral-400">{"</>"}</div>
                    <span className="text-lg font-semibold text-white">MockForge</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-400">asdigaksl</span>
                    <Button variant="ghost" size="sm" className="text-neutral-400" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </div>
            {title && (
                <div className="border-t border-neutral-800 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{title}</h1>
                            {subtitle && <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>}
                        </div>
                        {action && (
                            <Button onClick={action.onClick} className="bg-white text-black hover:bg-neutral-100">
                                {action.label}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
