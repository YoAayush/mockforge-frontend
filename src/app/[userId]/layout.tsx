"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/components/userProvider";
import { useContext } from "react";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    const { session } = useContext(UserContext);

    // useEffect(() => {
    //     if (!loading && !session) {
    //         router.replace("/");
    //     }
    // }, [session, loading, router]);

    useEffect(() => {
        const session = localStorage.getItem("sb-spxrnaigyqpejdrnbtrn-auth-token");

        if (!session) {
            router.replace("/auth/login");
        }
    }, []);

    // // will make a good looking loader
    // if (loading) return <p>Loading...</p>;
    if (!session) return null;

    return (
        <>
            {children}
        </>
    )
}