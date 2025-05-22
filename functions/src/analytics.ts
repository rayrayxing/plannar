import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AnalyticsEvent, CreateAnalyticsEventData } from './types/analytics.types';

const db = admin.firestore();
const analyticsCollection = 'analyticsEvents'; // Storing raw events here
// const aggregatedAnalyticsCollection = 'analyticsAggregated'; // For pre-computed aggregates

export const logAnalyticsEvent = functions.https.onCall(async (data: CreateAnalyticsEventData, context) => {
  // Analytics events can often be logged by unauthenticated users (e.g., initial page loads)
  // or system events. If user-specific, context.auth.uid should match data.userId or be an admin.
  if (data.userId && (!context.auth || (context.auth.uid !== data.userId && context.auth.token.role !== 'admin'))) {
      throw new functions.https.HttpsError('permission-denied', 'Cannot log analytics event for another user unless admin.');
  }
  if (!data.type || !data.data) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields: type or data.');
  }

  try {
    const now = admin.firestore.Timestamp.now();
    const newEventRef = db.collection(analyticsCollection).doc();
    const event: AnalyticsEvent = {
      id: newEventRef.id,
      userId: data.userId || (context.auth ? context.auth.uid : undefined),
      ...data,
      timestamp: now,
    };

    await newEventRef.set(event);
    // Avoid logging PII in general logs if data might contain it.
    functions.logger.info(`Analytics event logged: ${event.id}`, { type: event.type, userId: event.userId });
    return { id: event.id, message: 'Analytics event logged successfully' };

  } catch (error) {
    functions.logger.error('Error logging analytics event:', error);
    throw new functions.https.HttpsError('internal', 'Could not log analytics event.', error);
  }
});

// Placeholder for functions to retrieve/aggregate analytics (TRD Sec 4.1.8)
// export const getAggregatedAnalytics = functions.https.onCall(async (data, context) => {
//   ensureAdmin(context); // Or specific analytics role
//   // ... logic to query and aggregate from analyticsEvents or read from analyticsAggregated
// });

