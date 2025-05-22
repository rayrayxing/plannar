import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ModalInteraction, CreateModalInteractionData } from './types/modalInteraction.types';

const db = admin.firestore();
const modalInteractionsCollection = 'modalInteractions';

export const logModalInteraction = functions.https.onCall(async (data: CreateModalInteractionData, context) => {
  if (!context.auth) {
    // Allow unauthenticated for certain interactions if needed, but generally require auth
    // For now, let's assume user is mostly authenticated when modals are relevant
    // Or, if userId is passed explicitly and validated, could be an option for specific scenarios.
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to log modal interactions.');
  }

  // Validate required fields
  if (!data.userId || !data.modalType || !data.action) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields: userId, modalType, or action.');
  }
  // Ensure the userId in data matches the authenticated user, or that the caller has permission to log for others (e.g. admin)
  if (context.auth.uid !== data.userId && context.auth.token.role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Cannot log modal interaction for another user.');
  }

  try {
    const now = admin.firestore.Timestamp.now();
    const newInteractionRef = db.collection(modalInteractionsCollection).doc();
    const interaction: ModalInteraction = {
      id: newInteractionRef.id,
      ...data,
      timestamp: now,
    };

    await newInteractionRef.set(interaction);
    functions.logger.info(`Modal interaction logged: ${interaction.id}`, { userId: data.userId, modalType: data.modalType, action: data.action });
    return { id: interaction.id, message: 'Modal interaction logged successfully' };

  } catch (error) {
    functions.logger.error('Error logging modal interaction:', error);
    throw new functions.https.HttpsError('internal', 'Could not log modal interaction.', error);
  }
});

// Future: functions to get/list modal interactions for analytics or admin purposes
// export const listModalInteractions = functions.https.onCall(async (data, context) => { ... });

