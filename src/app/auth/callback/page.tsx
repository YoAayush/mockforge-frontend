"use client";

import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import Loader from "@/components/Loader";

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
                    redirect("/login");
                } else {
                    router.replace("/");
                }
            }, 3000);
        };

        getSession();
    }, [router]);

    return (
        <Loader />
    );
}