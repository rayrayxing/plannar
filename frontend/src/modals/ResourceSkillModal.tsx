import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { Skill } from '../../../functions/src/types/skill.types'; // Assuming global skill type
import { getSkills } from '../services/skillService'; // Assuming service exists
import { useModal } from '../contexts/ModalContext'; // For logging

// Define the structure for a skill within a resource's profile
export interface ResourceSkillData {
  skillId: string;
  skillName?: string; // Denormalized, for convenience
  level: 'Beginner' | 'Intermediate' | 'Expert'; // Example levels
  experienceYears: number;
  // Add other fields from TRD as needed: lastUsed, certifications, notes
}

export interface ResourceSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResourceSkillData) => void;
  initialData?: Partial<ResourceSkillData>;
  resourceId?: string; // For logging context if needed
}

const ResourceSkillModal: React.FC<ResourceSkillModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  resourceId,
}) => {
  const [globalSkills, setGlobalSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState<boolean>(true);
  const [selectedSkillId, setSelectedSkillId] = useState<string>(initialData?.skillId || '');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>(initialData?.level || 'Beginner');
  const [experienceYears, setExperienceYears] = useState<number>(initialData?.experienceYears || 0);
  const { logModalAction } = useModal();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoadingSkills(true);
        const skills = await getSkills();
        setGlobalSkills(skills);
      } catch (error) {
        console.error("Failed to fetch global skills:", error);
        // Handle error (e.g., show a message)
      } finally {
        setLoadingSkills(false);
      }
    };
    if (isOpen) {
      fetchSkills();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setSelectedSkillId(initialData.skillId || '');
      setLevel(initialData.level || 'Beginner');
      setExperienceYears(initialData.experienceYears || 0);
    } else {
      // Reset form for new entry
      setSelectedSkillId('');
      setLevel('Beginner');
      setExperienceYears(0);
    }
  }, [initialData, isOpen]);


  const handleSubmit = () => {
    if (!selectedSkillId) {
      // Basic validation: ensure a skill is selected
      alert('Please select a skill.'); // Replace with better UX
      logModalAction({ action: 'SUBMIT_FAIL', outcome: 'Validation Error', errorDetails: 'Skill not selected' });
      return;
    }
    const selectedSkill = globalSkills.find(s => s.id === selectedSkillId);
    onSubmit({
      skillId: selectedSkillId,
      skillName: selectedSkill?.name, // Denormalize name
      level,
      experienceYears,
    });
    logModalAction({ action: 'SUBMIT_SUCCESS', outcome: 'Skill Added/Updated' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="resource-skill-dialog-title">
      <DialogTitle id="resource-skill-dialog-title">{initialData?.skillId ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
      <DialogContent sx={{ paddingTop: '16px !important' }}>
        {loadingSkills ? (
          <CircularProgress />
        ) : (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="skill-select-label">Skill</InputLabel>
              <Select
                labelId="skill-select-label"
                value={selectedSkillId}
                label="Skill"
                onChange={(e) => setSelectedSkillId(e.target.value as string)}
                disabled={!!initialData?.skillId} // Disable if editing, skill shouldn't change
              >
                {globalSkills.map((skill) => (
                  <MenuItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="level-select-label">Proficiency Level</InputLabel>
              <Select
                labelId="level-select-label"
                value={level}
                label="Proficiency Level"
                onChange={(e) => setLevel(e.target.value as 'Beginner' | 'Intermediate' | 'Expert')}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Expert">Expert</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              label="Years of Experience"
              type="number"
              fullWidth
              value={experienceYears}
              onChange={(e) => setExperienceYears(Math.max(0, parseInt(e.target.value, 10) || 0))}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { logModalAction({ action: 'CLOSE', outcome: 'CANCELLED' }); onClose(); }}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {initialData?.skillId ? 'Save Changes' : 'Add Skill'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceSkillModal;
