"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/lib/userProvider";
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

    setTimeout(() => {
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#0a192f] via-[#020617] to-[#000] text-blue-100 px-4">
            <div className="flex flex-col items-center justify-center gap-6 text-center">
                {/* Spinner */}
                <div className="relative h-12 w-12 sm:h-14 sm:w-14">
                    <div className="absolute inset-0 animate-spin rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-transparent"></div>
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#0a192f] via-[#020617] to-[#000]"></div>
                </div>

                {/* Text */}
                {/* <p className="text-base sm:text-lg md:text-xl font-medium tracking-wide animate-pulse">
                    Loading...
                </p> */}
            </div>
        </div>
    }, 1500);

    return (
        <>
            {children}
        </>
    )
}