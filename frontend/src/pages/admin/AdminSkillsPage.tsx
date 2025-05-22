import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Button, Box, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Skill } from '../../../functions/src/types/skill.types'; // Adjust path
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase'; // Adjust path

import { useModal } from '../../hooks/useModal'; // Adjust path
import { trackEvent } from '../../utils/analytics'; // Adjust path

const AdminSkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);

  const { openModal, closeModal } = useModal();

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const listSkillsFunction = httpsCallable<void, { skills: Skill[] }>(functions, 'listSkills');
      const result = await listSkillsFunction();
      setSkills(result.data.skills);
    } catch (err: any) {
      console.error('Error fetching skills:', err);
      setError(err.message || 'Failed to fetch skills.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleOpenCreateModal = () => {
    openModal('skillForm', { skill: null, onSkillSaved: handleSkillSaved });
  };

  const handleOpenEditModal = (skill: Skill) => {
    openModal('skillForm', { skill: skill, onSkillSaved: handleSkillSaved });
  };

  const handleSkillSaved = (savedSkill: Skill) => {
    // Refresh list or update locally
    fetchSkills(); 
    closeModal('skillForm');
  };

  const handleOpenDeleteConfirm = (skill: Skill) => {
    setSelectedSkill(skill);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setSelectedSkill(null);
    setDeleteConfirmOpen(false);
  };

  const handleDeleteSkill = async () => {
    if (!selectedSkill || !selectedSkill.id) return;
    setLoading(true); // Consider a specific loading state for delete
    try {
      const deleteSkillFunction = httpsCallable<{ id: string }, void>(functions, 'deleteSkill');
      const skillIdToDelete = selectedSkill.id; // Capture before clearing selectedSkill
      const skillNameToDelete = selectedSkill.name;
      await deleteSkillFunction({ id: skillIdToDelete });
      trackEvent('SKILL_DELETED', { skillId: skillIdToDelete, skillName: skillNameToDelete });
      fetchSkills(); // Refresh list
      handleCloseDeleteConfirm();
    } catch (err: any) {
      console.error('Error deleting skill:', err);
      setError(err.message || 'Failed to delete skill.');
      // Potentially show error in delete dialog or as a snackbar
    }
    setLoading(false);
  };

  if (loading && skills.length === 0) {
    return <Container sx={{ textAlign: 'center', mt: 5 }}><CircularProgress /></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Skills
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
        >
          Add New Skill
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && skills.length > 0 && <CircularProgress sx={{mb: 2}}/>}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skills.map((skill) => (
              <TableRow
                key={skill.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {skill.name}
                </TableCell>
                <TableCell>{skill.category || '-'}</TableCell>
                <TableCell>{skill.description || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenEditModal(skill)} color="primary" aria-label="edit skill">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteConfirm(skill)} color="error" aria-label="delete skill">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {skills.length === 0 && !loading && (
                <TableRow>
                    <TableCell colSpan={4} align="center">
                        No skills found. Add some!
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>



      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the skill "{selectedSkill?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteSkill} color="error" autoFocus disabled={loading}>
            {loading && selectedSkill ? <CircularProgress size={20}/> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default AdminSkillsPage;

