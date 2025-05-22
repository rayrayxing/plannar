import React from 'react';

// Define a type for the props that your modal components will accept.
// This is a generic example; you might have more specific prop types for different modals.
export interface ModalComponentProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  data?: T; // Data passed when opening the modal
  // Any other common props modals might need
}

// The registry will map string keys to React functional components.
const modalRegistry: Record<string, React.FC<ModalComponentProps<any>>> = {};

export const registerModal = <P extends ModalComponentProps<any>>(
  type: string,
  component: React.FC<P>
) => {
  if (modalRegistry[type]) {
    console.warn(`Modal type "${type}" is already registered. Overwriting.`);
  }
  modalRegistry[type] = component as React.FC<ModalComponentProps<any>>;
};

export const getModalComponent = (type: string): React.FC<ModalComponentProps<any>> | undefined => {
  const component = modalRegistry[type];
  if (!component) {
    console.warn(`Modal type "${type}" not found in registry.`);
    return undefined;
  }
  return component;
};

// Example of registering a modal (would typically be done where modals are defined):
// import ExampleModalComponent from './ExampleModalComponent';
// registerModal('EXAMPLE_MODAL', ExampleModalComponent);

// Register SkillFormModal
import SkillFormModal from './SkillFormModal'; // Ensure SkillFormModalData is also exported or used correctly
registerModal('skillForm', SkillFormModal);

