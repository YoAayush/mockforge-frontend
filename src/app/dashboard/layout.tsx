"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/components/userProvider";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    const { session, loading } = useContext(UserContext);

    useEffect(() => {
        if (!loading && !session) {
            router.replace("/");
        }
    }, [session, loading, router]);

    // will make a good looking loader
    if (loading) return <p>Loading...</p>;
    if (!session) return null;

    return <>{children}</>;
}