'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Github } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false)

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }
        if (!formData.password) {
            newErrors.password = 'Password is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault()

    //     if (!validateForm()) {
    //         return
    //     }

    //     setLoading(true)
    //     // Simulate API call
    //     setTimeout(() => {
    //         setLoading(false)
    //         // In a real app, you would handle login here
    //         console.log('Login:', formData)
    //     }, 1000)
    // }

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
                redirectTo: "http://localhost:3000/auth/callback"
            }
        });
    };

    const handleEmailPassLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,

            // will do this captcha later ...
            // options: {
            //     captchaToken: ""
            // }
        })

        setLoading(false);

        // console.log(data, error);

        if (error) {
            console.error(error);
            // setErrors(error.message)

            if (error.message.includes("Email not confirmed")) {
                alert("Please confirm your email before logging in.")
                return;
            }

            alert(error.message);
            setErrors({ general: error.message });
            return;
        }

        if (data.weakPassword) {
            console.log(data.weakPassword);
            alert(data.weakPassword.message);
            return;
        }

        console.log("Logged in user:", data.user)
    };

    console.log(errors);
    console.log(formData.email, formData.password);

    // useEffect(() => {
    //     if (errors) {
    //         alert(errors);
    //     }
    // }, [errors])

    return (
        <form onSubmit={(e) => handleEmailPassLogin(e)} className="space-y-6">
            <div className="text-center">
                <div className="text-2xl font-semibold text-white mb-2">
                    <span className="text-blue-400">&lt;/&gt;</span> MockForge
                </div>
                <h1 className="text-xl font-semibold text-white mb-1">Welcome back</h1>
                <p className="text-sm text-slate-400">Sign in to your account</p>
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
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-white text-sm font-medium">
                            Password
                        </Label>
                        <Link
                            href="/auth/forgot-password"
                            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Forgot password?
                        </Link>
                    </div>
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
                {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <p className="text-center text-sm text-slate-400">
                Don't have an account?{' '}
                <Link
                    href="/auth/signup"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                >
                    Sign up
                </Link>
            </p>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-700">
                Made with Vercel
            </div>
        </form>
    )
}
