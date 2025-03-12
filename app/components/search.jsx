"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SearchComp() {
    const [search, setSearch] = useState("");
    const [allResults, setAllResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/fetchpost`);
                const data = await response.json();
                setAllResults(data);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (search.trim().length > 0) {
            const filtered = allResults.filter((post) =>
                post.title.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredResults(filtered);
            setShowResults(true);
        } else {
            setFilteredResults([]);
            setShowResults(false);
        }
    }, [search, allResults]);

    return (
        <div className="relative">
            <input 
                type="text" 
                placeholder="Search..."
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowResults(true)}
                className="border p-2 rounded-md w-64 text-white focus:ring focus:ring-blue-300"
            />

            {/* Search Dropdown */}
            {showResults && filteredResults.length > 0 && (
                <ul className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-50 border border-gray-200">
                    {filteredResults.map((post) => (
                        <li 
                            key={post._id} 
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => { setSearch(""); setShowResults(false); }} // Close dropdown on click
                        >
                            <Link href={`/feeds/${encodeURIComponent(post.title)}`} className="text-black block">
                                {post.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {showResults && filteredResults.length === 0 && (
                <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-50 border border-gray-200 p-2 text-gray-500">
                    No results found
                </div>
            )}
        </div>
    );
}
