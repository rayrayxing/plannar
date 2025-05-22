import React from 'react';
import { TextField, Button, Box, Typography, Grid, Paper, IconButton, Select, MenuItem, InputLabel, FormControl, Chip, List, ListItem, ListItemText, ListItemSecondaryAction, Rating } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Skill, CertificationDetail } from '../../../types/resource.types';
import { useModal } from '../../../contexts/ModalContext';

interface SkillsCertsFormSectionProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  certifications: CertificationDetail[];
  setCertifications: React.Dispatch<React.SetStateAction<CertificationDetail[]>>;
}

const SkillsCertsFormSection: React.FC<SkillsCertsFormSectionProps> = ({ skills, setSkills, certifications, setCertifications }) => {
  const { openModal } = useModal();

  const handleAddSkill = () => {
    openModal<'resourceSkill'>({
      modalType: 'resourceSkill',
      modalProps: {
        onSubmit: (newSkill) => {
          setSkills([...skills, newSkill]);
        },
      }
    });
  };

  const handleEditSkill = (index: number) => {
    const skillToEdit = skills[index];
    openModal<'resourceSkill'>({
      modalType: 'resourceSkill',
      modalProps: {
        initialData: skillToEdit,
        onSubmit: (updatedSkill) => {
          const updatedList = [...skills];
          updatedList[index] = updatedSkill;
          setSkills(updatedList);
        },
      }
    });
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddCertification = () => {
    openModal<'resourceCertification'>({
      modalType: 'resourceCertification',
      modalProps: {
        onSubmit: (newCertification) => {
          setCertifications([...certifications, newCertification]);
        },
      }
    });
  };

  const handleEditCertification = (index: number) => {
    const certToEdit = certifications[index];
    openModal<'resourceCertification'>({
      modalType: 'resourceCertification',
      modalProps: {
        initialData: certToEdit,
        onSubmit: (updatedCertification) => {
          const updatedList = [...certifications];
          updatedList[index] = updatedCertification;
          setCertifications(updatedList);
        },
      }
    });
  };

  const handleRemoveCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  return (
    <Paper elevation={2} className="p-4 mb-6">
      <Typography variant="h6" className="mb-4">Skills & Certifications</Typography>
      
      {/* Skills Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
        <Typography variant="subtitle1">Skills</Typography>
        <Button 
          variant="outlined" 
          onClick={handleAddSkill} 
          startIcon={<AddCircleOutlineIcon />}
        >
          Add Skill
        </Button>
      </Box>
      {skills.length > 0 && (
        <List dense sx={{ mt: 1 }}>
          {skills.map((skill, index) => (
            <ListItem 
              key={skill.name} 
              className="mb-1 border rounded"
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditSkill(index)} size="small" sx={{ mr: 0.5 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveSkill(index)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText 
                primary={skill.name}
                secondary={`Proficiency: ${skill.proficiency}/10, Experience: ${skill.yearsExperience} yr(s)`}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Certifications Section - Typography and Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
        <Typography variant="subtitle1">General Certifications</Typography>
        <Button 
          variant="outlined" 
          onClick={handleAddCertification} 
          startIcon={<AddCircleOutlineIcon />}
        >
          Add Certification
        </Button>
      </Box>
      {certifications.length > 0 && (
        <List dense sx={{ mt: 1 }}>
          {certifications.map((cert, index) => (
            <ListItem 
              key={cert.id || index} 
              className="mb-1 border rounded" 
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditCertification(index)} size="small" sx={{ mr: 0.5 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveCertification(index)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText 
                primary={cert.name}
                secondary={`${cert.issuingOrganization} | Issued: ${cert.issueDate} | Expires: ${cert.expirationDate || 'N/A'}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default SkillsCertsFormSection;
