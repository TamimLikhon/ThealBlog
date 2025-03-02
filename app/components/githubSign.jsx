import { signIn, signOut, useSession } from "next-auth/react";

import { FaGithub } from "react-icons/fa";
export default function GithubSign() {  
    const { data: session } = useSession();
    const handleLogin = async () => {
        if (session) {
            await signOut({ redirect: false });
        } else {
            await signIn("github", { callbackUrl: "http://localhost:3000" });
        }
    };
    return (
        <button
            onClick={handleLogin}
            className="w-full bg-white text-black p-3 rounded-lg hover:bg-gray-100 transition"
        >
            <FaGithub className="inline-block mr-2" /> Sign in with Github
        </button>
    );
}