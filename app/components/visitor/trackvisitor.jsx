'use client';

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function VisitorTracker({ title, authorEmail }) {
  useEffect(() => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('sessionId', sessionId);
    }

    const userAgent = navigator.userAgent;
    const tabOpenTime = Date.now();

    const sendVisitorData = () => {
      const tabCloseTime = Date.now();
      const durationMin = ((tabCloseTime - tabOpenTime) / 60000).toFixed(2);

      const data = JSON.stringify({
        title,
        authorEmail,
        sessionId,
        userAgent,
        duration: durationMin,
      });

      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon('/api/visitorapi/trackvisitor', blob);
    };

    window.addEventListener('beforeunload', sendVisitorData);
    return () => {
      window.removeEventListener('beforeunload', sendVisitorData);
    };
  }, [title, authorEmail]);

  return null;
}
