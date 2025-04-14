"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function FetchVisitor() {
  const [userData, setUserData] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;
      console.log("Sending email query:", session.user.email);


      try {
        const res = await fetch(`/api/visitorapi/visitorstats?email=${session.user.email}`);
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        setUserData(data.visits || []);
      } catch (err) {
        console.error("Error fetching visitor data", err);
      }
    };

    fetchData();
  }, [session]);

  return (
    <div>
      <h2 className="text-xl font-bold">Visitor Stats</h2>
      <ul>
        {userData.map((item, index) => (
          <li key={index}>
            <strong>{item.title}</strong>: {item.totalDuration}min
          </li>
        ))}
      </ul>
    </div>
  );
}
