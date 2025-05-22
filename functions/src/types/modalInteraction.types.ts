export interface ModalInteraction {
  id: string;
  userId: string; // ID of the user interacting with the modal
  modalType: string; // Type of modal (e.g., 'CREATE_PROJECT', 'EDIT_RESOURCE_SKILL')
  action: 'opened' | 'closed' | 'submitted' | 'cancelled' | string; // Specific action taken
  timestamp: FirebaseFirestore.Timestamp;
  durationMs?: number; // How long the modal was open, if applicable
  metadata?: Record<string, any>; // Any other relevant data (e.g., form values on submit, error messages)
  sessionId?: string; // Optional session ID for tracking user flow
  deviceInfo?: {
    browser?: string;
    os?: string;
    screenResolution?: string;
  };
}

// Data expected when creating a new modal interaction record
export interface CreateModalInteractionData extends Omit<ModalInteraction, 'id' | 'timestamp'> {
  // Timestamp will be set by the server
}

