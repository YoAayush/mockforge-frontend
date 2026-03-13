'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { UserContext } from '../userProvider'
import { useContext } from 'react'

export function Header() {
    const [isDark, setIsDark] = useState(true);
    const data = useContext(UserContext);
    console.log(data);

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    return (
        <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold text-white text-lg">
                    <span className="text-blue-400">&lt;/&gt;</span>
                    MockForge
                </Link>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {
                        data.user ? (
                            <>
                                <Link href={`/dashboard/${data.user.id}`}>
                                    <Button
                                        variant="ghost"
                                        className="bg-white text-black hover:bg-gray-200"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button
                                        variant="ghost"
                                        className="text-white hover:bg-slate-800"
                                    >
                                        Login
                                    </Button>
                                </Link>

                                <Link href="/auth/signup">
                                    <Button className="bg-white text-black hover:bg-gray-200">
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
