'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Github } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export function SignupForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required'
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleGithubLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: "http://localhost:4000/auth/callback"
            }
        });
    }

    const handleSignUpEmailPass = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullName,
                },
                emailRedirectTo: "http://localhost:4000/auth/callback"
            }
        })

        setLoading(false);

        if (error) {
            console.log(error);
            return;
        }
        // console.log(data);

        // Email confirmation enabled
        if (!data.session) {
            alert("Signup successful. Please check your email to verify your account.")
            return
        }

        // Only runs if email confirmation disabled OR already verified
        // console.log("User created:", data.user);
    };

    return (
        <form onSubmit={(e) => handleSignUpEmailPass(e)} className="min-w-md space-y-6">
            <div className="text-center">
                <div className="text-2xl font-semibold text-white mb-2 cursor-pointer" onClick={() => {
                    router.replace("/");
                }}>
                    <span className="text-blue-400">&lt;/&gt;</span> MockForge
                </div>
                <h1 className="text-xl font-semibold text-white mb-1">Create your account</h1>
                <p className="text-sm text-slate-400">Start building mock APIs in seconds</p>
            </div>

            <Button
                type="button"
                onClick={handleGithubLogin}
                className="w-full bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 font-semibold flex items-center justify-center gap-2"
            >
                <Github size={18} />
                Continue with GitHub
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900 text-slate-400">Or</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white text-sm font-medium">
                        Full Name
                    </Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                    {errors.fullName && (
                        <p className="text-xs text-red-400">{errors.fullName}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-white text-sm font-medium">
                        Email
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                    {errors.email && (
                        <p className="text-xs text-red-400">{errors.email}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-white text-sm font-medium">
                        Password
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                    {errors.password && (
                        <p className="text-xs text-red-400">{errors.password}</p>
                    )}
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold"
            >
                {loading ? 'Creating account...' : 'Create account'}
            </Button>

            <p className="text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link
                    href="/auth/login"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                >
                    Sign in
                </Link>
            </p>
        </form>
    )
}
