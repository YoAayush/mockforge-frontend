"use client";

import { useUser } from "@/lib/userProvider"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
// import { useSearchParams } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { user, session, loading } = useUser();
  // console.log(user, session, loading)
  const router = useRouter();
  const pathname = usePathname();

  // const searchParams = useSearchParams();
  // const isError = searchParams.get("error") === "true";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;

    // if (pathname.startsWith("/auth") && session && user && !isError ) {
    if (pathname.startsWith("/auth") && session && user) {
      router.replace(`/${user?.id}`);
    }
  }, [mounted, loading, session, user, pathname]);

  // 🚨 Hydration fix: render nothing until mounted
  if (!mounted) return null;

  // if (loading) return <p>Loading !!!</p>

  return (
    <div className="min-h-screen w-full bg-primary flex items-center justify-center">
      {children}
    </div>
  )
}
