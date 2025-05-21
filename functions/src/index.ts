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
