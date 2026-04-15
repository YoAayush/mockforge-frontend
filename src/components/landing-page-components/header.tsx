'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, HelpCircle, Moon, Sun } from 'lucide-react'
// import { useState } from 'react'
import { UserContext } from '../../lib/userProvider'
import { useContext } from 'react'
// import { useTheme } from '@/lib/theme-provider'
import { useTheme } from 'next-themes'

export function Header() {
    // const [isDark, setIsDark] = useState(true);
    const data = useContext(UserContext);
    const { theme, setTheme } = useTheme();
    // console.log(data);

    // const toggleTheme = () => {
    //     setIsDark(!isDark)
    // }

    return (
        <header className="border-b border-default sticky backdrop-blur-sm top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <Link href="/" className="flex items-center gap-2 font-semibold text-primary text-lg">
                    <span className="text-accent">&lt;/&gt;</span>
                    MockForge
                </Link>

                <div className="flex items-center gap-4">

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-lg border border-default text-secondary hover:text-primary hover:bg-[rgb(var(--bg-tertiary))] transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Links */}
                    <Link
                        href="/usage"
                        className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-1.5"
                    >
                        <BookOpen className="h-4 w-4" />
                        Usage
                    </Link>

                    <Link
                        href="/documentation"
                        className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-1.5"
                    >
                        <HelpCircle className="h-4 w-4" />
                        Documentation
                    </Link>

                    {/* Auth Section */}
                    {
                        data.user ? (
                            <Link href={`/${data.user.id}`}>
                                <Button
                                    variant="ghost"
                                    className="bg-tertiary text-primary hover:bg-secondary"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button
                                        variant="ghost"
                                        className="text-secondary hover:bg-[rgb(var(--bg-tertiary))] hover:text-primary"
                                    >
                                        Login
                                    </Button>
                                </Link>

                                <Link href="/auth/signup">
                                    <Button
                                        className="bg-[rgb(var(--accent))] text-primary hover:opacity-90"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )
                    }
                </div>
            </div>
        </header>
    )
}
