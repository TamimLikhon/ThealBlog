"use client";
import { useState } from "react";
export default function ToggleBgButton() {
  const [isWhite, setIsWhite] = useState(true);

  return (
    <div className={`h-screen flex items-center justify-center ${isWhite ? "bg-white" : "bg-black"}`}>
      <button
        onClick={() => setIsWhite(!isWhite)}
        className="text-white bg-gray-800 hover:bg-gray-700"
      >
        Toggle Background
      </button>
    </div>
  );
}
