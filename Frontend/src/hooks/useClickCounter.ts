"use client";

export function useClickCounter() {
  const trackEvent = (eventName: string) => {
    try {
      const currentCount = parseInt(localStorage.getItem(`counter_${eventName}`) || "0", 10);
      localStorage.setItem(`counter_${eventName}`, (currentCount + 1).toString());
      
      // Here you would typically also make an API call to your backend
      // fetch('/api/track', { method: 'POST', body: JSON.stringify({ event: eventName }) })
      console.log(`[Tracking] Event: ${eventName}, New Count: ${currentCount + 1}`);
    } catch (e) {
      console.error("Failed to track event", e);
    }
  };

  return { trackEvent };
}
