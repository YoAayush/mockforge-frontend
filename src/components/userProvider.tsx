"use client";

import { useState, useEffect, createContext, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

type UserContextType = {
    session: Session | null;
};

export const UserContext = createContext<UserContextType>({
    session: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    console.log(session);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
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
        <UserContext.Provider value={{ session }}>
            {children}
        </UserContext.Provider>
    );
};