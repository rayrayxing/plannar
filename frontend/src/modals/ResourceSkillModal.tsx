import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { SkillEndorsement } from '../types/resource.types';
// Assuming Skill type for global skills list is compatible or fetched via a service that provides { id: string, name: string }
// For now, let's define a local simple Skill type for the dropdown.
interface GlobalSkill { id: string; name: string; } // Define GlobalSkill locally
import { getSkills } from '../services/skillService'; // Assuming service exists
import { useModal } from '../contexts/ModalContext'; // For logging

// ResourceSkillData is replaced by SkillEndorsement from '../types/resource.types'

export interface ResourceSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SkillEndorsement) => void;
  initialData?: Partial<SkillEndorsement>;
  resourceId?: string; // For logging context if needed
}

const ResourceSkillModal: React.FC<ResourceSkillModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  resourceId,
}) => {
  const [globalSkills, setGlobalSkills] = useState<GlobalSkill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState<boolean>(true);
  const [selectedSkillId, setSelectedSkillId] = useState<string>(initialData?.skillId || '');
  const [proficiency, setProficiency] = useState<number>(initialData?.proficiency || 1); 
  const [yearsExperience, setYearsExperience] = useState<number>(initialData?.yearsExperience || 0);
  const [lastUsedDate, setLastUsedDate] = useState<string | undefined>(initialData?.lastUsedDate);
  const [interestLevel, setInterestLevel] = useState<number | undefined>(initialData?.interestLevel); 
  const [notes, setNotes] = useState<string | undefined>(initialData?.notes);
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
      setProficiency(initialData.proficiency || 1);
      setYearsExperience(initialData.yearsExperience || 0);
      setLastUsedDate(initialData.lastUsedDate);
      setInterestLevel(initialData.interestLevel);
      setNotes(initialData.notes);
    } else {
      // Reset form for new entry
      setSelectedSkillId('');
      setProficiency(1);
      setYearsExperience(0);
      setLastUsedDate(undefined);
      setInterestLevel(undefined);
      setNotes(undefined);
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
    const submissionData: SkillEndorsement = {
      skillId: selectedSkillId,
      // skillName: selectedSkill?.name, // skillName is optional in SkillEndorsement, should be set if available
      proficiency,
      yearsExperience,
    };
    if (selectedSkill?.name) submissionData.skillName = selectedSkill.name;
    if (lastUsedDate) submissionData.lastUsedDate = lastUsedDate;
    // Ensure interestLevel is only added if it's a valid number (0-5, assuming 0 is valid or handled by validation)
    // Or if the scale is 1-5, then if (interestLevel !== undefined && interestLevel >= 1 && interestLevel <=5)
    // For now, if it's defined, pass it.
    if (interestLevel !== undefined) submissionData.interestLevel = interestLevel;
    if (notes) submissionData.notes = notes;

    onSubmit(submissionData);
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
            <TextField
              margin="normal"
              label="Proficiency (1-10)"
              type="number"
              fullWidth
              value={proficiency}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val >= 1 && val <= 10) setProficiency(val);
                // else if (e.target.value === '') setProficiency(1); // Allow empty to clear, or set to default
              }}
              onBlur={(e) => { // Ensure a valid value on blur if empty or out of range
                if (proficiency < 1 || proficiency > 10 || isNaN(proficiency)) setProficiency(1);
              }}
              InputProps={{ inputProps: { min: 1, max: 10 } }}
              helperText="Enter a number between 1 and 10"
            />
            <TextField
              margin="normal"
              label="Years of Experience"
              type="number"
              fullWidth
              value={yearsExperience}
              onChange={(e) => setYearsExperience(Math.max(0, parseInt(e.target.value, 10) || 0))}
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              margin="normal"
              label="Last Used Date (Optional)"
              type="date" // Using type="date" for better UX
              fullWidth
              value={lastUsedDate || ''}
              onChange={(e) => setLastUsedDate(e.target.value || undefined)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              label="Interest Level (1-5, Optional)"
              type="number"
              fullWidth
              value={interestLevel === undefined ? '' : interestLevel}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (e.target.value === '') {
                    setInterestLevel(undefined);
                } else if (val >= 1 && val <= 5) {
                    setInterestLevel(val);
                }
              }}
              InputProps={{ inputProps: { min: 1, max: 5 } }}
              helperText="Enter a number between 1 and 5, or leave blank"
            />
            <TextField
              margin="normal"
              label="Notes (Optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={notes || ''}
              onChange={(e) => setNotes(e.target.value || undefined)}
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
