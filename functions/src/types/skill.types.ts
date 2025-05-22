export interface Skill {
  id: string;
  name: string;
  category: string; // e.g., 'Programming Language', 'Software', 'Soft Skill'
  description?: string;
  // Potentially, a list of resources who have this skill, or proficiency levels, if not managed in Resource.skills
  // For a global skills list, keeping it simple is often best.
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface CreateSkillData extends Omit<Skill, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateSkillData extends Partial<Omit<Skill, 'id' | 'createdAt' | 'updatedAt'> {} 

