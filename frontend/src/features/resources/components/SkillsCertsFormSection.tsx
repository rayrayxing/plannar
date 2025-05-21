import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper, IconButton, Select, MenuItem, InputLabel, FormControl, Chip, List, ListItem, ListItemText, ListItemSecondaryAction, Rating } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Skill } from '../../../types/resource.types';

interface SkillsCertsFormSectionProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  certifications: string[];
  setCertifications: React.Dispatch<React.SetStateAction<string[]>>;
}

const SkillsCertsFormSection: React.FC<SkillsCertsFormSectionProps> = ({ skills, setSkills, certifications, setCertifications }) => {
  const [currentSkillName, setCurrentSkillName] = useState('');
  const [currentSkillProficiency, setCurrentSkillProficiency] = useState<number>(5);
  const [currentSkillYears, setCurrentSkillYears] = useState<number>(1);
  const [currentCertification, setCurrentCertification] = useState('');

  const handleAddSkill = () => {
    if (currentSkillName.trim() === '') return;
    setSkills([...skills, { 
      name: currentSkillName.trim(), 
      proficiency: currentSkillProficiency, 
      yearsExperience: currentSkillYears 
    }]);
    setCurrentSkillName('');
    setCurrentSkillProficiency(5);
    setCurrentSkillYears(1);
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddCertification = () => {
    if (currentCertification.trim() === '') return;
    setCertifications([...certifications, currentCertification.trim()]);
    setCurrentCertification('');
  };

  const handleRemoveCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  return (
    <Paper elevation={2} className="p-4 mb-6">
      <Typography variant="h6" className="mb-4">Skills & Certifications</Typography>
      
      {/* Skills Section */}
      <Typography variant="subtitle1" className="mt-4 mb-2">Skills</Typography>
      <Grid container spacing={2} alignItems="flex-end" className="mb-4">
        <Grid item xs={12} sm={4}>
          <TextField 
            label="Skill Name"
            value={currentSkillName}
            onChange={(e) => setCurrentSkillName(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="skill-proficiency-label">Proficiency (1-10)</InputLabel>
            <Select
              labelId="skill-proficiency-label"
              label="Proficiency (1-10)"
              value={currentSkillProficiency}
              onChange={(e) => setCurrentSkillProficiency(e.target.value as number)}
            >
              {[...Array(10)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField 
            label="Years Exp."
            type="number"
            value={currentSkillYears}
            onChange={(e) => setCurrentSkillYears(Math.max(0, parseInt(e.target.value, 10) || 0))}
            fullWidth
            size="small"
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button 
            variant="outlined"
            onClick={handleAddSkill} 
            startIcon={<AddCircleOutlineIcon />}
            fullWidth
          >
            Add Skill
          </Button>
        </Grid>
      </Grid>
      {skills.length > 0 && (
        <List dense>
          {skills.map((skill, index) => (
            <ListItem key={index} className="mb-1 border rounded">
              <ListItemText 
                primary={skill.name}
                secondary={`Proficiency: ${skill.proficiency}/10, Experience: ${skill.yearsExperience} yr(s)`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveSkill(index)} size="small">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Certifications Section */}
      <Typography variant="subtitle1" className="mt-6 mb-2">General Certifications</Typography>
      <Grid container spacing={2} alignItems="flex-end" className="mb-4">
        <Grid item xs={12} sm={10}>
          <TextField 
            label="Certification Name"
            value={currentCertification}
            onChange={(e) => setCurrentCertification(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button 
            variant="outlined" 
            onClick={handleAddCertification} 
            startIcon={<AddCircleOutlineIcon />}
            fullWidth
          >
            Add Cert
          </Button>
        </Grid>
      </Grid>
      {certifications.length > 0 && (
        <Box className="flex flex-wrap gap-1">
          {certifications.map((cert, index) => (
            <Chip 
              key={index} 
              label={cert} 
              onDelete={() => handleRemoveCertification(index)} 
              className="mb-1"
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default SkillsCertsFormSection;
