"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import Loader from "@/components/Loader";

export default function Callback() {
    const router = useRouter();
    const hasRun = useRef(false); // prevents double execution

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const getSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                console.log(data);

                // if (error) {
                //     router.replace("/");
                //     return;
                // }

                // const user = data.session?.user;
                // console.log(user);

                // if (!data.session?.user) return;

                if (error || !data.session?.user) {
                    router.replace("/auth/login");
                    return;
                }

                const session = data.session;

                try {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
                        {
                            userId: session.user?.id,
                            name: session.user?.user_metadata?.full_name, // saved at the time of signup using optional data
                            email: session.user?.email
                        },
                        {
                            // now i can use {session.access_token} directly in my backend api request as a bearer token ...
                            headers: {
                                Authorization: `Bearer ${session?.access_token}`
                            }
                        }
                    );
                } catch (err) {
                    console.log("Register skipped:", err);
                }

                // CRITICAL: Clean URL (removes #access_token)
                window.history.replaceState(null, "", "/");

                // Redirect instantly (no timeout)
                router.replace(`/${session.user.id}`);

                // setTimeout(() => {
                //     if (data?.session) {
                //         router.replace(`/${data.session.user?.id}`);
                //     } else if (error) {
                //         router.replace("/login");
                //     } else {
                //         router.replace("/");
                //     }
                // }, 3000);
            } catch (error) {
                console.error("Auth callback failed:", error);
                router.replace("/auth/login");
            }
        };

        getSession();
    }, [router]);

    return (
        <Loader />
    );
}