export interface AnalyticsEvent {
  id: string;
  type: string; // e.g., 'PAGE_VIEW', 'FEATURE_USED', 'ERROR_OCCURRED', 'PERFORMANCE_METRIC'
  userId?: string; // Optional: if the event is user-specific
  timestamp: FirebaseFirestore.Timestamp;
  data: Record<string, any>; // Flexible data payload
  // e.g., { page: '/home', durationMs: 1500 } for PAGE_VIEW
  // e.g., { featureName: 'createProject', success: true } for FEATURE_USED
  sessionId?: string;
  appVersion?: string;
  deviceInfo?: {
    browser?: string;
    os?: string;
    screenResolution?: string;
  };
}

// Data expected when creating a new analytics event
export interface CreateAnalyticsEventData extends Omit<AnalyticsEvent, 'id' | 'timestamp'> {
  // Timestamp will be set by the server
}

// Example of a more specific aggregated analytic document (could be in a different collection)
export interface DailyFeatureUsage {
  date: string; // YYYY-MM-DD
  featureName: string;
  usageCount: number;
  uniqueUsers: number;
  // other aggregated metrics
}

