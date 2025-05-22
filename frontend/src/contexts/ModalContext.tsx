import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { functions, auth } from '../firebase'; // Assuming firebase is in src/firebase.ts
import { httpsCallable } from 'firebase/functions';
import { CreateModalInteractionData } from '../../../functions/src/types/modalInteraction.types'; // Adjust path


export interface ModalConfig<P = any> {
  type: string; // Corresponds to a key in ModalRegistry
  props?: P;
  // Optional: specific styling, sizing, or behavior overrides for this instance
  title?: string;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
}

interface ModalContextType {
  isOpen: boolean;
  modalConfig: ModalConfig | null;
  openModal: <P>(config: ModalConfig<P>) => void; // Changed from openModal: <P>(type: string, props?: P) => void;
  closeModal: () => void; // Changed from closeModal: (type: string) => void;
  logModalAction: (actionDetails: Omit<CreateModalInteractionData, 'userId' | 'timestamp' | 'modalType'>) => void; // New
  // For modal stack if implemented later
  // openModalStacked: <P>(config: ModalConfig<P>) => void;
  // closeModalStacked: () => void;
  // activeModals: ModalConfig[]; 
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

let logModalInteractionFn: any = null;
try {
  logModalInteractionFn = httpsCallable<CreateModalInteractionData, void>(functions, 'logModalInteraction');
} catch (error) {
  console.error("Error initializing logModalInteraction callable function:", error);
  // Handle the error appropriately, e.g., by disabling modal logging
}

const logInteraction = async (interactionData: Omit<CreateModalInteractionData, 'userId' | 'timestamp'>) => {
  if (!logModalInteractionFn) {
    console.warn('logModalInteraction function not initialized. Skipping log.');
    return;
  }
  const userId = auth.currentUser?.uid || null;
  try {
    await logModalInteractionFn({ ...interactionData, userId });
    console.log('Modal interaction logged:', interactionData.modalType, interactionData.action);
  } catch (error) {
    console.error('Error logging modal interaction:', error);
  }
};


interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [openedAt, setOpenedAt] = useState<number | null>(null);

  const openModal = useCallback(<P>(config: ModalConfig<P>) => {
    setModalConfig(config);
    setOpenedAt(Date.now());
    logInteraction({
      modalType: config.type,
      action: 'OPEN',
      inputData: config.props ? JSON.stringify(config.props) : undefined,
    });
  }, []); // Consider if logInteraction needs to be a dependency if it's not stable

  const closeModal = useCallback(() => {
    if (modalConfig && openedAt) {
      const durationMs = Date.now() - openedAt;
      logInteraction({
        modalType: modalConfig.type,
        action: 'CLOSE',
        durationMs,
        // outcome: 'CANCELLED' // Example: if all closes are considered cancellations initially
      });
    }
    setModalConfig(null);
    setOpenedAt(null);
  }, [modalConfig, openedAt]); // Dependencies updated

  const logModalAction = useCallback((actionDetails: Omit<CreateModalInteractionData, 'userId' | 'timestamp' | 'modalType'>) => {
    if (modalConfig) {
      logInteraction({
        modalType: modalConfig.type,
        ...actionDetails,
      });
    } else {
      console.warn("logModalAction called when no modal is active. Details:", actionDetails);
    }
  }, [modalConfig]);


  // Basic implementation without stacking for now
  const isOpen = modalConfig !== null;

  return (
    <ModalContext.Provider value={{ isOpen, modalConfig, openModal, closeModal, logModalAction }}>
      {children}
      {/* Modal rendering will happen here or in a dedicated App-level component listening to this context */}
    </ModalContext.Provider>
  );
};

