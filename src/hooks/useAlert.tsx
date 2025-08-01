import { useContext } from 'react';
import { AlertContext } from '../contexts/AlertContext';
import type { AlertContextType, AlertStack } from '../types/alert';

interface ExtendedAlertContextType extends AlertContextType {
  isAlertOpen: boolean;
  currentAlert: AlertStack | undefined;
  stackLength: number;
}

export const useAlert = (): ExtendedAlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  
  return {
    ...context,
    // 편의 함수들
    isAlertOpen: context.stack.length > 0,
    currentAlert: context.stack[context.activeIndex],
    stackLength: context.stack.length
  };
}; 