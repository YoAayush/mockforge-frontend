"use client";

import { useUser } from "@/lib/userProvider"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { user, session, loading } = useUser();
  // console.log(user,loading)
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // or a loading spinner
    // if (!pathname.startsWith("/auth")) return;

    if (pathname.startsWith("/auth") && session && user) {
      router.replace(`/${user?.id}`);
    }
  }, [loading, session, user, pathname]);

  // if (loading) return <p>Loading !!!</p>

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center">
      {children}
    </div>
  )
}
