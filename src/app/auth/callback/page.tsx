"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Callback() {
    const router = useRouter();

    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            // if (error) {
            //     router.replace("/");
            //     return;
            // }

            if (data.session) {
                router.replace(`/dashboard/${data.session.user.id}`);
            } else {
                router.replace("/");
            }
        };

        getSession();
    }, [router]);

    return <p>Signing you in...</p>;
}