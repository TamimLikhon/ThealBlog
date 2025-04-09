"use client";
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function TrackVisitor() {
  const startTimestamp = Date.now();

  const getOrCreateCookie = (name, expiryHours = 24) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];

    const id = uuidv4();
    const expires = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${id}; expires=${expires}; path=/`;
    return id;
  };

  useEffect(() => {
    const sendVisitorData = async () => {
      const sessionId = getOrCreateCookie('sessionId', 24);
      const endTimestamp = Date.now();

      try {
        const res = await fetch('/api/visitorapi/trackvisitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: window.location.href,
            sessionId,
            userAgent: navigator.userAgent,
            startTimestamp,
            endTimestamp,
          }),
        });

        const data = await res.json();
        console.log("✅ Visitor data sent:", data);
      } catch (error) {
        console.error("❌ Error sending visitor data:", error);
      }
    };

    sendVisitorData();
  }, []);

  return null;
}
