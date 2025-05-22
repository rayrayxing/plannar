import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress, Box, Typography
} from '@mui/material';
import { Skill, CreateSkillData, UpdateSkillData } from '../../../functions/src/types/skill.types'; // Adjust path as needed
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase'; // Adjust path as needed

import { useModal } from '../../hooks/useModal'; // Adjust path as needed
import { trackEvent } from '../../utils/analytics'; // Adjust path as needed
import { ModalComponentProps } from '../ModalRegistry'; // Corrected path

export interface SkillFormModalData {
  skill?: Skill | null;
  onSkillSaved: (skill: Skill) => void;
}

const SkillFormModal: React.FC<ModalComponentProps<SkillFormModalData>> = ({ isOpen, onClose, data }) => {
  const { skill, onSkillSaved } = data || {}; // Destructure from data
  const { logModalAction } = useModal();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setDescription(skill.description || '');
      setCategory(skill.category || '');
    } else {
      setName('');
      setDescription('');
      setCategory('');
    }
    setError(null); // Reset error when modal opens or skill changes
  }, [skill, isOpen]); // Changed 'open' to 'isOpen'

  const handleSubmit = async () => {
    if (!onSkillSaved) { // Guard against onSkillSaved being undefined
        console.error('onSkillSaved callback is not provided to SkillFormModal');
        setError('Configuration error: Save callback missing.');
        return;
    }
    setLoading(true);
    setError(null);
    try {
      let savedSkillData: Skill;
      if (skill && skill.id) {
        // Update existing skill
        const updateSkillFunction = httpsCallable<UpdateSkillData, { skill: Skill }>(functions, 'updateSkill');
        const result = await updateSkillFunction({ id: skill.id, name, description, category });
        savedSkillData = result.data.skill;
      } else {
        // Create new skill
        const createSkillFunction = httpsCallable<CreateSkillData, { skill: Skill }>(functions, 'createSkill');
        const result = await createSkillFunction({ name, description, category });
        savedSkillData = result.data.skill;
      }
      onSkillSaved(savedSkillData);
      logModalAction({ action: 'SUBMIT_SUCCESS', outcome: 'Skill saved', outputData: JSON.stringify(savedSkillData) });
      trackEvent(skill && skill.id ? 'SKILL_UPDATED' : 'SKILL_CREATED', { skillId: savedSkillData.id, skillName: savedSkillData.name });
      if (onClose) onClose(); // Close modal on success, ensure onClose is defined
    } catch (err: any) {
      console.error('Error saving skill:', err);
      setError(err.message || 'Failed to save skill. Check console for details.');
      logModalAction({ action: 'SUBMIT_FAIL', outcome: 'Error saving skill', errorDetails: err.message });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth> // Changed 'open' to 'isOpen'
      <DialogTitle>{skill ? 'Edit Skill' : 'Create New Skill'}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
          <TextField
            label="Skill Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="Category (Optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : (skill ? 'Save Changes' : 'Create Skill')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SkillFormModal;

