import React, { createContext, useContext, useReducer } from 'react';
import type { ModalContextType, ModalStack, ModalOptions } from '../types/modal';

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

type ModalAction = 
  | { type: 'OPEN_MODAL'; payload: { component: React.ComponentType<Record<string, unknown>>; props?: Record<string, unknown>; options?: ModalOptions } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'PUSH_MODAL'; payload: { component: React.ComponentType<Record<string, unknown>>; props?: Record<string, unknown>; options?: ModalOptions } }
  | { type: 'POP_MODAL' }
  | { type: 'GO_TO_MODAL'; payload: { index: number } }
  | { type: 'CLEAR_STACK' };

interface ModalState {
  stack: ModalStack[];
  activeIndex: number;
}

// 고유 ID 생성 함수
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'OPEN_MODAL': {
      return {
        stack: [{
          id: generateId(),
          component: action.payload.component,
          props: action.payload.props || {},
          options: {
            preserveState: true,
            preserveScroll: true,
            keepInDOM: true,
            ...action.payload.options
          },
          isActive: true
        }],
        activeIndex: 0
      };
    }

    case 'PUSH_MODAL': {
      const newStack = state.stack.map(item => ({ ...item, isActive: false }));
      newStack.push({
        id: generateId(),
        component: action.payload.component,
        props: action.payload.props || {},
        options: {
          preserveState: true,
          preserveScroll: true,
          keepInDOM: true,
          ...action.payload.options
        },
        isActive: true
      });
      return {
        stack: newStack,
        activeIndex: newStack.length - 1
      };
    }

    case 'POP_MODAL': {
      if (state.stack.length <= 1) {
        return { stack: [], activeIndex: -1 };
      }
      const updatedStack = state.stack.slice(0, -1);
      updatedStack[updatedStack.length - 1].isActive = true;
      return {
        stack: updatedStack,
        activeIndex: updatedStack.length - 1
      };
    }

    case 'GO_TO_MODAL': {
      if (action.payload.index < 0 || action.payload.index >= state.stack.length) {
        return state;
      }
      const stackWithActive = state.stack.map((item, index) => ({
        ...item,
        isActive: index === action.payload.index
      }));
      return {
        stack: stackWithActive,
        activeIndex: action.payload.index
      };
    }

    case 'CLEAR_STACK':
      return { stack: [], activeIndex: -1 };

    case 'CLOSE_MODAL':
      return { stack: [], activeIndex: -1 };

    default:
      return state;
  }
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, { stack: [], activeIndex: -1 });

  const openModal = (component: React.ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: ModalOptions) => {
    dispatch({ type: 'OPEN_MODAL', payload: { component, props, options } });
  };

  const closeModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const pushModal = (component: React.ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: ModalOptions) => {
    dispatch({ type: 'PUSH_MODAL', payload: { component, props, options } });
  };

  const popModal = () => {
    dispatch({ type: 'POP_MODAL' });
  };

  const goToModal = (index: number) => {
    dispatch({ type: 'GO_TO_MODAL', payload: { index } });
  };

  const clearStack = () => {
    dispatch({ type: 'CLEAR_STACK' });
  };

  return (
    <ModalContext.Provider value={{
      stack: state.stack,
      activeIndex: state.activeIndex,
      openModal,
      closeModal,
      pushModal,
      popModal,
      goToModal,
      clearStack
    }}>
      {children}
    </ModalContext.Provider>
  );
}; 

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within ModalProvider');
  }
  return context;
}; 