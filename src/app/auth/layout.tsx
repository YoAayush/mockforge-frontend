import { useContext } from "react"
import { UserContext } from "@/components/userProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { user, loading } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("sb-spxrnaigyqpejdrnbtrn-auth-token");

    if (session) {
      router.replace(`/dashboard/${user?.id}`);
    }
  }, []);

  if (!loading) return <p>Navigating you to dashboard !!!</p>

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
