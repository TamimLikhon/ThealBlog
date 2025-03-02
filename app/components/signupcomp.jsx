"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleSign from "./googleSign";
import GithubSign from "./githubSign";
import { Eye, EyeOff } from "lucide-react";
export default function Signupcomp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        setMessage(""); 
        setSuccess(false); 

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, phonenumber, firstname, lastname, address, city, district, zipcode }),

            });

            const data = await res.json();
            if (data.success) {
                setMessage("New user created");
                setSuccess(true);
            } else {
                setMessage(data.message || "User Exists");
            }
        } catch (error) {
            setMessage("An error occurred");
        }
    };

    // Redirect to signin when signup is successful

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center">Create an Account</h2>
                <p className="text-black-600 text-center mb-6">Sign up to get started</p>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                
                <div className="relative w-full mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                </div>

                <input 
                    type="number"
                    placeholder="Phone"
                    value={phonenumber}
                    onChange={(e) => setPhonenumber(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="text"
                    placeholder="First Name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="text"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="text"
                    placeholder="District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="number"
                    placeholder="Zip Code"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                
                <button
                    onClick={() => {
                        handleSignup();
                        setTimeout(() => {
                            router.push("/auth/login"); // Navigate to login page
                        }, 1500); // Delay of 1.5 seconds
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Sign Up
                </button>

                {message && (
                    <div className={`mt-4 text-center ${success ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </div>
                )}
                <div className="my-6 flex items-center">
                    <hr className="w-full border-gray-300" />
                    <p className="px-2 text-gray-500">or continue with</p>
                    <hr className="w-full border-gray-300" />
                </div>

                <div className="flex gap-4">
                    <GoogleSign />
                    <GithubSign />
                </div>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-blue-500 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
