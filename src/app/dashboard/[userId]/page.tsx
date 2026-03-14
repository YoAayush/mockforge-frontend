"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { UserContext } from "@/components/userProvider";

export default function Dashboard() {
    const router = useRouter();
    const { userId } = useParams();
    console.log(userId);

    // const { data: {user} } = await supabase.auth.getUser();
    // console.log(user)

    const { user } = useContext(UserContext);
    console.log(user);
    
    // useEffect(() => {
    //     if (!loading && !session) {
    //         router.replace("/");
    //     }
    // }, [loading, session, router]);

    // if (loading) return <p>Loading...</p>;
    // if (!session) return null;

    // now i can use {session.access_token} directly in my backend api request as a bearer token ...
    // console.log(session);

    const logout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log(error);
            return;
        }

        // router.push("/auth/callback");
        router.replace("/");
    };

    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 text-xl font-bold border-b border-gray-700">
                    MockForge
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
                        Dashboard
                    </button>

                    <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
                        Projects
                    </button>

                    <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
                        Schemas
                    </button>

                    <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
                        API Keys
                    </button>

                    <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
                        Settings
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-700 text-sm">
                    Developer Platform
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">

                {/* Navbar */}
                <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Dashboard</h1>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                            Logged in
                        </div>

                        <button
                            // onClick={() => router.push("/")}
                            onClick={(e) => logout(e)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6 grid grid-cols-3 gap-6">

                    {/* Card 1 */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-sm text-gray-500">Projects</h2>
                        <p className="text-3xl font-bold mt-2">3</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-sm text-gray-500">Schemas</h2>
                        <p className="text-3xl font-bold mt-2">12</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-sm text-gray-500">API Calls</h2>
                        <p className="text-3xl font-bold mt-2">1.2k</p>
                    </div>

                    {/* Activity Section */}
                    <div className="col-span-3 bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>Created new schema "User"</li>
                            <li>Generated 100 mock records</li>
                            <li>Created project "Testing API"</li>
                        </ul>
                    </div>

                </main>

            </div>
        </div>
    );
}