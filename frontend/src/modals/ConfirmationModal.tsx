import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose(); // Typically close modal after confirmation
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="confirmation-dialog-title">
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {typeof message === 'string' ? <DialogContentText>{message}</DialogContentText> : message}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelText}
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
