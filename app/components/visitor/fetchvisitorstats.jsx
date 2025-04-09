"use client";
import React, { useState, useEffect } from "react";

export default function FetchVisitor() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/visitorapi/visitorstats');
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching visitor data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">Visitor Stats</h2>
      <ul>
        {userData.map((item, index) => (
          <li key={index}>
            <strong>{item.url}</strong>: {item.duration}
          </li>
        ))}
      </ul>
    </div>
  );
}
