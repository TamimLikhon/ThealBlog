"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleSign from "./googleSign";
import GithubSign from "./githubSign";

export default function Logincomp() {
    const { data: session } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        if (session) {
            setError("You are already signed in. Please log out first.");
            return;
        }

        setError(""); 
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false
        });
        if (result?.error) {
            setError(result.error);
        } else {
            router.push("/?refresh=true");
        }
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        setError(""); 
        router.push("/auth/login"); 
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center">Welcome back</h2>
                <p className="text-gray-600 text-center mb-6">Sign in to your account</p>

                {session ? (
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">You are already signed in as <strong>{session.user?.email}</strong>.</p>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 outline-none"
                            />
                            <button
                                onClick={handleLogin}
                                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                            >
                                Sign in
                            </button>
                            {error && <p className="text-red-500 text-center">{error}</p>}
                        </div>

                        <div className="my-6 flex items-center">
                            <hr className="w-full border-gray-300" />
                            <p className="px-2 text-gray-500">or continue with</p>
                            <hr className="w-full border-gray-300" />
                        </div>

                        <div className="flex gap-4">
                          <GoogleSign   />
                          <GithubSign />
                        </div>

                        <p className="text-center text-gray-600 mt-4">
                            Don't have an account?{" "}
                            <a href="/auth/signup" className="text-blue-600 hover:underline">Sign up</a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}