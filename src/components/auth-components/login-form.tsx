'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Github } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation';
// import { UserContext } from '../userProvider'

export function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false)
    const router = useRouter();

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
                redirectTo: "http://localhost:4000/auth/callback"
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
        // router.push(`/${data.user.id}`);
    };

    console.log(errors);
    console.log(formData.email, formData.password);

    // useEffect(() => {
    //     if (errors) {
    //         alert(errors);
    //     }
    // }, [errors])

    return (
        <form onSubmit={(e) => handleEmailPassLogin(e)} className="min-w-md space-y-6 text-primary">

            {/* Header */}
            <div className="text-center">
                <div
                    className="text-2xl font-semibold text-primary mb-2 cursor-pointer"
                    onClick={() => router.replace("/")}
                >
                    <span className="text-accent">&lt;/&gt;</span> MockForge
                </div>

                <h1 className="text-xl font-semibold text-primary mb-1">
                    Welcome back
                </h1>

                <p className="text-sm text-secondary">
                    Sign in to your account
                </p>
            </div>

            {/* GitHub Button */}
            <Button
                type="button"
                onClick={handleGithubLogin}
                className="w-full bg-secondary text-primary hover:bg-tertiary border border-default font-semibold flex items-center justify-center gap-2"
            >
                <Github size={18} />
                Continue with GitHub
            </Button>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-default"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-primary text-tertiary">Or</span>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-primary text-sm font-medium">
                        Email
                    </Label>

                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-primary border border-default text-primary placeholder:text-tertiary focus:ring-2 focus:ring-[rgb(var(--accent))]"
                    />

                    {errors.email && (
                        <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-primary text-sm font-medium">
                            Password
                        </Label>

                        <Link
                            href="/auth/forgot-password"
                            className="text-xs text-accent hover:opacity-80 font-medium"
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
                        className="bg-primary border border-default text-primary placeholder:text-tertiary focus:ring-2 focus:ring-[rgb(var(--accent))]"
                    />

                    {errors.password && (
                        <p className="text-xs text-red-500">{errors.password}</p>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[rgb(var(--accent))] text-white hover:opacity-90 font-semibold"
            >
                {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            {/* Footer */}
            <p className="text-center text-sm text-secondary">
                Don't have an account?{' '}
                <Link
                    href="/auth/signup"
                    className="text-accent hover:opacity-80 font-medium"
                >
                    Sign up
                </Link>
            </p>

            {loading && (
                <p className="text-center text-secondary text-sm">
                    Logging in, please wait...
                </p>
            )}
        </form>
    )
}
