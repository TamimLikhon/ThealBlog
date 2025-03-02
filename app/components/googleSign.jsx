import { signIn, signOut, useSession } from "next-auth/react";

import { FaGoogle } from "react-icons/fa";

export default function GoogleSign() { 
    const { data: session } = useSession();
    const handleLogin = async () => {
        if (session) {
            await signOut({ redirect: false });
        } else {
            await signIn("google", { callbackUrl: "http://localhost:3000" });
        }
    };
    return (
        <button
            onClick={handleLogin}
            className="w-full bg-white text-black p-3 rounded-lg hover:bg-gray-100 transition"
        >
            <FaGoogle className="inline-block mr-2" /> Sign in with Google
        </button>
    );
}