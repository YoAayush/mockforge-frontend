"use client";

import { useState, useEffect, createContext, ReactNode, useContext } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import Loader from "@/components/Loader";
// import { useRouter } from "next/navigation";

type UserContextType = {
    session: Session | null | undefined;
    user: User | null;
    loading: Boolean
};

export const UserContext = createContext<UserContextType>({
    session: undefined,
    user: null,
    loading: true
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    // const router = useRouter();
    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    // console.log(session);

    useEffect(() => {
        let isMounted = true;

        const getSession = async () => {
            const { data } = await supabase.auth.getSession();

            if (!isMounted) return;

            setSession(data.session);
            setUser(data.session?.user ?? null);
            setLoading(false);

            // if no session → redirect
            // if (!data.session) {
            //     console.log("no session provided");
            //     router.replace("/");
            // }
        };

        getSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!isMounted) return;
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return <Loader />; // or loader
    }

    return (
        <UserContext.Provider value={{ session, user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useProject must be used within ProjectProvider");
    }

    return context; // { session, user, loading }
};