import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Skill, CreateSkillData, UpdateSkillData } from './types/skill.types';

const db = admin.firestore();
const skillsCollection = 'skills';

// Helper to ensure admin role for CUD operations on global skills
const ensureAdmin = (context: functions.https.CallableContext) => {
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'User must be an admin to manage skills.');
  }
};

export const createSkill = functions.https.onCall(async (data: CreateSkillData, context) => {
  ensureAdmin(context);

  if (!data.name || !data.category) {
    throw new functions.https.HttpsError('invalid-argument', 'Skill name and category are required.');
  }

  try {
    const now = admin.firestore.Timestamp.now();
    const newSkillRef = db.collection(skillsCollection).doc();
    const skill: Skill = {
      id: newSkillRef.id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    await newSkillRef.set(skill);
    functions.logger.info(`Skill created: ${skill.id}`, skill);
    return skill;
  } catch (error) {
    functions.logger.error('Error creating skill:', error);
    throw new functions.https.HttpsError('internal', 'Could not create skill.', error);
  }
});

export const listSkills = functions.https.onCall(async (data, context) => {
  // All authenticated users can list skills
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to list skills.');
  }
  try {
    const snapshot = await db.collection(skillsCollection).orderBy('name').get();
    const skills = snapshot.docs.map(doc => doc.data() as Skill);
    return skills;
  } catch (error) {
    functions.logger.error('Error listing skills:', error);
    throw new functions.https.HttpsError('internal', 'Could not list skills.', error);
  }
});

export const getSkillById = functions.https.onCall(async (data: { id: string }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to get a skill.');
  }
  if (!data.id) {
    throw new functions.https.HttpsError('invalid-argument', 'Skill ID is required.');
  }
  try {
    const doc = await db.collection(skillsCollection).doc(data.id).get();
    if (!doc.exists) {
      throw new functions.https.HttpsError('not-found', 'Skill not found.');
    }
    return doc.data() as Skill;
  } catch (error) {
    functions.logger.error(`Error getting skill ${data.id}:`, error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError('internal', 'Could not get skill.', error);
  }
});

export const updateSkill = functions.https.onCall(async (data: { id: string } & UpdateSkillData, context) => {
  ensureAdmin(context);
  const { id, ...updateData } = data;
  if (!id) {
    throw new functions.https.HttpsError('invalid-argument', 'Skill ID is required for update.');
  }
  if (Object.keys(updateData).length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'No update data provided.');
  }

  try {
    const skillRef = db.collection(skillsCollection).doc(id);
    const doc = await skillRef.get();
    if (!doc.exists) {
      throw new functions.https.HttpsError('not-found', 'Skill not found for update.');
    }
    await skillRef.update({ ...updateData, updatedAt: admin.firestore.Timestamp.now() });
    functions.logger.info(`Skill updated: ${id}`, updateData);
    return { id, ...updateData };
  } catch (error) {
    functions.logger.error(`Error updating skill ${id}:`, error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError('internal', 'Could not update skill.', error);
  }
});

export const deleteSkill = functions.https.onCall(async (data: { id: string }, context) => {
  ensureAdmin(context);
  if (!data.id) {
    throw new functions.https.HttpsError('invalid-argument', 'Skill ID is required for deletion.');
  }
  try {
    const skillRef = db.collection(skillsCollection).doc(data.id);
    const doc = await skillRef.get();
    if (!doc.exists) {
      throw new functions.https.HttpsError('not-found', 'Skill not found for deletion.');
    }
    await skillRef.delete();
    functions.logger.info(`Skill deleted: ${data.id}`);
    return { id: data.id, message: 'Skill deleted successfully' };
  } catch (error) {
    functions.logger.error(`Error deleting skill ${data.id}:`, error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError('internal', 'Could not delete skill.', error);
  }
});

