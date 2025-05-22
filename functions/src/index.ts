import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// This should ideally be done only once. 
// Make sure your Firebase project is set up and you have the service account key configured for local emulation or deployment.
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Placeholder helloWorld function (can be removed or kept for testing)
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase! Plannar backend is active.");
});

// Import and re-export resource functions
// Grouping them like this helps organize by domain
import * as resourceHandlers from './resources';

export const createResource = resourceHandlers.createResource;
export const listResources = resourceHandlers.listResources;
export const getResourceById = resourceHandlers.getResourceById;
export const updateResource = resourceHandlers.updateResource;
export const getResourceSkills = resourceHandlers.getResourceSkills;
// Add other resource handlers here as they are implemented

// Import and re-export project and task functions
import * as projectHandlers from './projects';

export const createProject = projectHandlers.createProject;
export const listProjects = projectHandlers.listProjects;
export const getProjectById = projectHandlers.getProjectById;
export const updateProject = projectHandlers.updateProject;
export const createTask = projectHandlers.createTask;
export const listTasks = projectHandlers.listTasks;
export const updateTask = projectHandlers.updateTask;
// Add other project/task handlers here as they are implemented

// Import and re-export skill functions (TRD Sec 4.1.6)
import * as skillHandlers from './skills';

export const createSkill = skillHandlers.createSkill;
export const listSkills = skillHandlers.listSkills;
export const getSkillById = skillHandlers.getSkillById;
export const updateSkill = skillHandlers.updateSkill;
export const deleteSkill = skillHandlers.deleteSkill;

// Import and re-export modal interaction functions (TRD Sec 4.1.7)
import * as modalInteractionHandlers from './modalInteractions';

export const logModalInteraction = modalInteractionHandlers.logModalInteraction;

// Import and re-export analytics functions (TRD Sec 4.1.8)
import * as analyticsHandlers from './analytics';

export const logAnalyticsEvent = analyticsHandlers.logAnalyticsEvent;

// Firebase Auth Triggers (TRD Sec 4.1.1 - Custom Claims for Roles)
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  functions.logger.info(`New user created: ${user.uid}`, { email: user.email });
  // Set default custom claims for the new user (e.g., a default role)
  // Roles can be 'admin', 'manager', 'user', etc. as per TRD Sec 3.4 & 6.2.2
  const defaultRole = 'user'; // Or 'pending_approval' if manual approval is needed
  try {
    await admin.auth().setCustomUserClaims(user.uid, { role: defaultRole });
    functions.logger.info(`Custom claims set for user ${user.uid}`, { role: defaultRole });
    // Optionally, create a user profile document in Firestore here if not handled by client/another function
    // Example: 
    // await admin.firestore().collection('users').doc(user.uid).set({
    //   email: user.email,
    //   displayName: user.displayName,
    //   role: defaultRole,
    //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
    //   // other initial fields...
    // });
    // functions.logger.info(`User profile created in Firestore for ${user.uid}`);

  } catch (error) {
    functions.logger.error(`Error setting custom claims for user ${user.uid}`, error);
  }
});

// HTTP Callable function to get current user details including custom claims (TRD Sec 4.1.1)
// This can be called by the client to get user data after login/refresh.
export const getUserData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const uid = context.auth.uid;
  // const token = context.auth.token || null; // context.auth.token contains all claims
  try {
    const userRecord = await admin.auth().getUser(uid);
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      customClaims: userRecord.customClaims, // This will include the role
      // Add any other data from userRecord or a separate Firestore user profile doc if needed
    };
  } catch (error) {
    functions.logger.error(`Error fetching user data for ${uid}`, error);
    throw new functions.https.HttpsError('internal', 'Unable to fetch user data.');
  }
});

