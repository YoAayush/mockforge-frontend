"use client";

import { useState, useEffect, createContext, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type UserContextType = {
    session: Session | null;
    user: User | null;
    loading: Boolean
};

export const UserContext = createContext<UserContextType>({
    session: null,
    user: null,
    loading: true
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    // console.log(session);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            setUser(data.session?.user ?? null);
            setLoading(false);

            // if no session → redirect
            if (!data.session) {
                router.replace("/");
            }
        };

        getSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ session, user, loading }}>
            {children}
        </UserContext.Provider>
    );
};