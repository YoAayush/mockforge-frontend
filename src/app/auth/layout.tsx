"use client";

import { useContext } from "react"
import { UserContext } from "@/components/userProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { user, session, loading } = useContext(UserContext);
  // console.log(user,loading)
  const router = useRouter();

  useEffect(() => {
    if (!loading && session && user) {
      router.replace(`/dashboard/${user?.id}`);
    }
  }, [loading, session, user, router]);

  // if (loading) return <p>Loading !!!</p>

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center">
      {children}
    </div>
  )
}
