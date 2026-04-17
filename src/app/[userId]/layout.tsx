"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/lib/userProvider";
import { useContext } from "react";
// import { useParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/Loader";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    const { session } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     if (!loading && !session) {
    //         router.replace("/");
    //     }
    // }, [session, loading, router]);

    useEffect(() => {
        // Wait until session is resolved
        if (session === undefined) return;

        const validateUser = async () => {
            try {
                if (session === null || !session?.access_token) {
                    router.replace("/auth/login");
                    return;
                }

                await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    }
                );

                setLoading(false);
            } catch (error) {
                router.replace("/auth/login");
            }
        };

        validateUser();
    }, [session, router]);

    // useEffect(() => {
    //     const session = localStorage.getItem("sb-spxrnaigyqpejdrnbtrn-auth-token");

    //     if (!session) {
    //         router.replace("/auth/login");
    //     }
    // }, []);

    // // will make a good looking loader
    // if (loading) return <Loader />;
    // if (!session) return null;

    // still loading session
    if (session === undefined || loading) {
        return <Loader />;
    }

    // if (session === null) {
    //     router.replace("/auth/login");
    //     return null;
    // }

    return (
        <>
            {children}
        </>
    )
}