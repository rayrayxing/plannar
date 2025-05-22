import { httpsCallable } from 'firebase/functions';
import { functions, auth } from '../firebase'; // Adjust path as needed
import { CreateAnalyticsEventData } from '../../../functions/src/types/analytics.types'; // Adjust path as needed

let logAnalyticsEventFn: any = null;
try {
  logAnalyticsEventFn = httpsCallable<CreateAnalyticsEventData, void>(functions, 'logAnalyticsEvent');
} catch (error) {
  console.error("Error initializing logAnalyticsEvent callable function:", error);
}

interface EventData {
  [key: string]: any;
}

/**
 * Logs an analytics event.
 * @param eventType Type of the event (e.g., 'PAGE_VIEW', 'SKILL_CREATED').
 * @param eventData Additional data associated with the event.
 */
export const trackEvent = async (eventType: string, eventData?: EventData) => {
  if (!logAnalyticsEventFn) {
    console.warn('logAnalyticsEvent function not initialized. Skipping analytics event.');
    return;
  }

  const userId = auth.currentUser?.uid || null;
  // sessionId can be implemented using sessionStorage or a global state
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    sessionStorage.setItem('sessionId', sessionId);
  }

  const dataToLog: Omit<CreateAnalyticsEventData, 'timestamp'> = {
    eventType,
    userId,
    path: window.location.pathname + window.location.search,
    sessionId,
    eventData: eventData ? JSON.stringify(eventData) : undefined,
  };

  try {
    await logAnalyticsEventFn(dataToLog);
    console.log('Analytics event logged:', eventType, dataToLog);
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
};

// Example: Track page view on initial load or route change
// trackEvent('PAGE_VIEW');
