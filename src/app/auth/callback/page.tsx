"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";

export default function Callback() {
    const router = useRouter();

    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            // console.log(data);

            // if (error) {
            //     router.replace("/");
            //     return;
            // }

            // const user = data.session?.user;
            // console.log(user);

            if (!data.session?.user) return;

            try {
                await axios.post(
                    "http://localhost:3000/api/v1/auth/register",
                    {
                        userId: data.session?.user?.id,
                        name: data.session?.user?.user_metadata?.full_name, // saved at the time of signup using optional data
                        email: data.session?.user?.email
                    },
                    {
                        // now i can use {data.session?.access_token} directly in my backend api request as a bearer token ...
                        headers: {
                            Authorization: `Bearer ${data.session?.access_token}`
                        }
                    }
                );
            } catch (err) {
                console.log("Register skipped:", err);
            }

            setTimeout(() => {
                if (data?.session) {
                    router.replace(`/${data.session.user?.id}`);
                } else if (error) {
                    router.replace("/login");
                    return;
                } else {
                    router.replace("/");
                }
            }, 3000);
        };

        getSession();
    }, [router]);

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#0a192f] via-[#020617] to-[#000] text-blue-100 px-4">
            <div className="flex flex-col items-center justify-center gap-6 text-center">
                {/* Spinner */}
                <div className="relative h-12 w-12 sm:h-14 sm:w-14">
                    <div className="absolute inset-0 animate-spin rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-transparent"></div>
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#0a192f] via-[#020617] to-[#000]"></div>
                </div>

                {/* Text */}
                <p className="text-base sm:text-lg md:text-xl font-medium tracking-wide animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
}