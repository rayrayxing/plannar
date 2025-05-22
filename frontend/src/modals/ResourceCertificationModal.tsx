import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFnsV3 } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { isValid, parseISO, format } from 'date-fns';
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
  const [issueDate, setIssueDate] = useState<Date | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [credentialId, setCredentialId] = useState('');
  const [credentialURL, setCredentialURL] = useState('');
  const [skillsCoveredInput, setSkillsCoveredInput] = useState(''); // Comma-separated string

  const { logModalAction } = useModal();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setIssuingOrganization(initialData.issuingOrganization || '');
        setIssueDate(initialData.issueDate && isValid(parseISO(initialData.issueDate)) ? parseISO(initialData.issueDate) : null);
        setExpirationDate(initialData.expirationDate && isValid(parseISO(initialData.expirationDate)) ? parseISO(initialData.expirationDate) : null);
        setCredentialId(initialData.credentialId || '');
        setCredentialURL(initialData.credentialURL || '');
        setSkillsCoveredInput(initialData.skillsCovered?.join(', ') || '');
      } else {
        // Reset form for new entry
        setName('');
        setIssuingOrganization('');
        setIssueDate(null);
        setExpirationDate(null);
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
      issueDate: format(issueDate!, 'yyyy-MM-dd'), // issueDate is non-null here due to validation
      expirationDate: expirationDate ? format(expirationDate, 'yyyy-MM-dd') : undefined,
      credentialId: credentialId || undefined,
      credentialURL: credentialURL || undefined,
      skillsCovered: skillsArray.length > 0 ? skillsArray : undefined,
    });
    logModalAction({ action: 'SUBMIT_SUCCESS', outcome: 'Certification Added/Updated' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="resource-certification-dialog-title" maxWidth="sm" fullWidth>
      <LocalizationProvider dateAdapter={AdapterDateFnsV3}>
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
              <DatePicker
                label="Issue Date"
                value={issueDate}
                onChange={(newValue) => setIssueDate(newValue)}
                slotProps={{ textField: { 
                  fullWidth: true, 
                  margin: "dense", 
                  required: true,
                  helperText: " ", // Reserve space
                } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Expiration Date (Optional)"
                value={expirationDate}
                onChange={(newValue) => setExpirationDate(newValue)}
                slotProps={{ textField: { 
                  fullWidth: true, 
                  margin: "dense",
                  helperText: " ", // Reserve space
                } }}
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
      </LocalizationProvider>
    </Dialog>
  );
};

export default ResourceCertificationModal;
