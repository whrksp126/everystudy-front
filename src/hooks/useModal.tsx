import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContext';
import type { ModalContextType, ModalStack } from '../types/modal';

interface ExtendedModalContextType extends ModalContextType {
  isModalOpen: boolean;
  currentModal: ModalStack | undefined;
  stackLength: number;
}

export const useModal = (): ExtendedModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  
  return {
    ...context,
    // 편의 함수들
    isModalOpen: context.stack.length > 0,
    currentModal: context.stack[context.activeIndex],
    stackLength: context.stack.length
  };
}; 