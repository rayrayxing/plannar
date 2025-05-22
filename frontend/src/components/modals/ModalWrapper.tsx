import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useModal } from '../../hooks/useModal';
import { getModalComponent } from './ModalRegistry';

// This component will be rendered at the App level to display the active modal.
const ModalRenderer: React.FC = () => {
  const { isOpen, modalConfig, closeModal } = useModal();

  if (!isOpen || !modalConfig) {
    return null;
  }

  const ModalComponent = getModalComponent(modalConfig.type);

  if (!ModalComponent) {
    // Optionally render a default error modal or just log and return null
    console.error(`Modal type "${modalConfig.type}" not found or component is undefined.`);
    return (
      <Dialog open={true} onClose={closeModal}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Error
          <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <p>Modal content could not be loaded. Type: {modalConfig.type}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Default Material UI Dialog props
  const dialogProps = {
    open: isOpen,
    onClose: modalConfig.disableBackdropClick ? undefined : closeModal, // Allow closing via backdrop unless disabled
    disableEscapeKeyDown: modalConfig.disableEscapeKeyDown || false,
    fullWidth: true, // Sensible default
    maxWidth: 'sm' as const, // Sensible default, can be overridden by specific modal components
    // ... other Mui Dialog props can be added here or overridden by ModalComponent
  };

  return (
    <ModalComponent 
      isOpen={isOpen} 
      onClose={closeModal} 
      data={modalConfig.props} 
      // Pass down Mui Dialog specific props if needed, or let ModalComponent handle its own Dialog rendering
      // For a true wrapper, ModalComponent might not render a Dialog itself but just its content.
      // Here, we assume ModalComponent is the content and ModalWrapper provides the Dialog shell.
      {...dialogProps} // This might not be ideal if ModalComponent renders its own Dialog.
                      // A better pattern might be for ModalComponent to return JSX for DialogContent, DialogTitle, DialogActions
                      // and ModalWrapper constructs the Dialog around it.
                      // For now, let's assume ModalComponent is self-contained or expects these props.
    />
    // Alternative: If ModalComponent is just the content:
    /*
    <Dialog {...dialogProps}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {modalConfig.title || modalConfig.type} 
        <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <ModalComponent isOpen={isOpen} onClose={closeModal} data={modalConfig.props} />
      </DialogContent>
      {/* DialogActions can be part of ModalComponent or defined here if standard */}
    /* </Dialog>
    */
  );
};

export default ModalRenderer;

// Note: The above ModalRenderer is one way to implement it.
// A common pattern is for the ModalProvider to render the active modal directly,
// or for a top-level App component to include <ModalRenderer />.
// The ModalWrapper.tsx name might be a misnomer if it becomes ModalRenderer.
// For now, this file provides the component that renders the actual Mui Dialog based on context.

// A true "ModalWrapper" might be a HOC or a component that individual modals use
// to get standard styling or behavior, but the ModalRenderer is the central piece for displaying them.

