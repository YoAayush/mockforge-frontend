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
            console.log(data);
            
            // if (error) {
            //     router.replace("/");
            //     return;
            // }

            // const user = data.session?.user;
            // console.log(user);

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
                console.error(err);
            }

            if (data?.session) {
                router.replace(`/dashboard/${data.session.user?.id}`);
            } else if (error) {
                router.replace("/");
                return;
            } else {
                router.replace("/");
            }
        };

        getSession();
    }, [router]);

    return <p>Signing you in...</p>;
}