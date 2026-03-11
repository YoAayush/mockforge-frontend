"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Callback() {
    const router = useRouter();

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            
            if (data.session) {
                router.push("/");
            } else {
                router.push("/auth/login");
            }
        };

        getSession();
    }, []);

    return <p>Signing you in...</p>;
}