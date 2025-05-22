import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid } from '@mui/material';
import { useModal } from '../contexts/ModalContext';

import { CertificationDetail } from '../types/resource.types';

// ResourceCertificationData interface removed, using CertificationDetail from resource.types.ts

export interface ResourceCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CertificationDetail) => void;
  initialData?: CertificationDetail;
  resourceId?: string; // For logging context
}

const ResourceCertificationModal: React.FC<ResourceCertificationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  resourceId,
}) => {
  const [name, setName] = useState('');
  const [issuingOrganization, setIssuingOrganization] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialURL, setCredentialURL] = useState('');
  const [skillsCoveredInput, setSkillsCoveredInput] = useState(''); // Comma-separated string

  const { logModalAction } = useModal();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setIssuingOrganization(initialData.issuingOrganization || '');
        setIssueDate(initialData.issueDate || '');
        setExpirationDate(initialData.expirationDate || '');
        setCredentialId(initialData.credentialId || '');
        setCredentialURL(initialData.credentialURL || '');
        setSkillsCoveredInput(initialData.skillsCovered?.join(', ') || '');
      } else {
        // Reset form for new entry
        setName('');
        setIssuingOrganization('');
        setIssueDate('');
        setExpirationDate('');
        setCredentialId('');
        setCredentialURL('');
        setSkillsCoveredInput('');
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!name || !issuingOrganization || !issueDate) {
      alert('Please fill in all required fields: Name, Issuing Organization, and Issue Date.'); // Basic validation
      logModalAction({ action: 'SUBMIT_FAIL', outcome: 'Validation Error', errorDetails: 'Required fields missing for certification' });
      return;
    }
    const skillsArray = skillsCoveredInput.split(',').map(s => s.trim()).filter(s => s);
    
    onSubmit({
      ...(initialData?.id && { id: initialData.id }), // Preserve ID if editing
      name,
      issuingOrganization,
      issueDate,
      expirationDate: expirationDate || undefined,
      credentialId: credentialId || undefined,
      credentialURL: credentialURL || undefined,
      skillsCovered: skillsArray.length > 0 ? skillsArray : undefined,
    });
    logModalAction({ action: 'SUBMIT_SUCCESS', outcome: 'Certification Added/Updated' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="resource-certification-dialog-title" maxWidth="sm" fullWidth>
      <DialogTitle id="resource-certification-dialog-title">
        {initialData?.id ? 'Edit Certification' : 'Add Certification'}
      </DialogTitle>
      <DialogContent sx={{ paddingTop: '16px !important' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Certification Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Issuing Organization"
              fullWidth
              value={issuingOrganization}
              onChange={(e) => setIssuingOrganization(e.target.value)}
              required
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Issue Date"
              type="date"
              fullWidth
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              margin="dense"
              // TODO: Consider replacing with @mui/x-date-pickers for better UX
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Expiration Date (Optional)"
              type="date"
              fullWidth
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="dense"
              // TODO: Consider replacing with @mui/x-date-pickers
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Credential ID (Optional)"
              fullWidth
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Credential URL (Optional)"
              fullWidth
              value={credentialURL}
              onChange={(e) => setCredentialURL(e.target.value)}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Skills Covered (Optional, comma-separated)"
              fullWidth
              value={skillsCoveredInput}
              onChange={(e) => setSkillsCoveredInput(e.target.value)}
              helperText="e.g., Project Management, Agile Methodology"
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { logModalAction({ action: 'CLOSE', outcome: 'CANCELLED' }); onClose(); }}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {initialData?.id ? 'Save Changes' : 'Add Certification'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceCertificationModal;
