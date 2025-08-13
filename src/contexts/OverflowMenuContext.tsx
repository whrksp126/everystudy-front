import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface OverflowMenuContextType {
  isOpen: boolean;
  triggerElement: HTMLElement | null;
  menuContent: ReactNode | null;
  openOverflowMenu: (element: HTMLElement, content: ReactNode) => void;
  closeOverflowMenu: () => void;
}

const OverflowMenuContext = createContext<OverflowMenuContextType | undefined>(undefined);

interface OverflowMenuProviderProps {
  children: ReactNode;
}

export const OverflowMenuProvider: React.FC<OverflowMenuProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const [menuContent, setMenuContent] = useState<ReactNode | null>(null);

  const openOverflowMenu = (element: HTMLElement, content: ReactNode) => {
    setTriggerElement(element);
    setMenuContent(content);
    setIsOpen(true);
  };

  const closeOverflowMenu = () => {
    setIsOpen(false);
    setTriggerElement(null);
    setMenuContent(null);
  };

  return (
    <OverflowMenuContext.Provider value={{
      isOpen,
      triggerElement,
      menuContent,
      openOverflowMenu,
      closeOverflowMenu,
    }}>
      {children}
    </OverflowMenuContext.Provider>
  );
};

export const useOverflowMenu = () => {
  const context = useContext(OverflowMenuContext);
  if (context === undefined) {
    throw new Error('useOverflowMenu must be used within an OverflowMenuProvider');
  }
  return context;
}; 