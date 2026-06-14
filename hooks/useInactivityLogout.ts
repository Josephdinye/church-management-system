// hooks/useInactivityLogout.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export function useInactivityLogout() {
  const { data: session } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    setShowWarning(false);

    // Main logout timer (10 minutes)
    timeoutRef.current = setTimeout(() => {
      if (session) {
        setShowWarning(true);
        setTimeLeft(60);

        // Final logout after 60 seconds warning
        warningTimeoutRef.current = setTimeout(() => {
          signOut({ callbackUrl: '/auth/signin', redirect: true });
        }, 60 * 1000);
      }
    }, 10 * 60 * 1000); // 10 minutes
  };

  // Countdown for warning
  useEffect(() => {
    if (!showWarning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning]);

  useEffect(() => {
    if (!session) {
      setShowWarning(false);
      return;
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => resetTimer();

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [session]);

  // Return warning UI component
  return { showWarning, timeLeft, resetTimer };
}