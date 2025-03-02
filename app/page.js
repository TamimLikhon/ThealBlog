"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function Home() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const refresh = searchParams.get("refresh");
        if (refresh === "true") {
            // Remove the query parameter to avoid refreshing on subsequent renders
            window.history.replaceState(null, "", "/");
            window.location.reload();
        }
    }, [searchParams]);

    return (
        <div>
        </div>
    );
}