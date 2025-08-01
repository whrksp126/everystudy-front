import React, { createContext, useContext, useReducer } from 'react';
import type { AlertContextType, AlertStack, AlertOptions } from '../types/alert';

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

type AlertAction = 
  | { type: 'OPEN_ALERT'; payload: { component: React.ComponentType<Record<string, unknown>>; props?: Record<string, unknown>; options?: AlertOptions } }
  | { type: 'CLOSE_ALERT' }
  | { type: 'PUSH_ALERT'; payload: { component: React.ComponentType<Record<string, unknown>>; props?: Record<string, unknown>; options?: AlertOptions } }
  | { type: 'POP_MODAL' }
  | { type: 'GO_TO_MODAL'; payload: { index: number } }
  | { type: 'CLEAR_STACK' };

interface AlertState {
  stack: AlertStack[];
  activeIndex: number;
}

// 고유 ID 생성 함수
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const alertReducer = (state: AlertState, action: AlertAction): AlertState => {
  switch (action.type) {
    case 'OPEN_ALERT': {
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

    case 'PUSH_ALERT': {
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

    case 'POP_ALERT': {
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

    case 'GO_TO_ALERT': {
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

    case 'CLOSE_ALERT':
      return { stack: [], activeIndex: -1 };

    default:
      return state;
  }
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, { stack: [], activeIndex: -1 });

  const openAlert = (component: React.ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: AlertOptions) => {
    dispatch({ type: 'OPEN_ALERT', payload: { component, props, options } });
  };

  const closeAlert = () => {
    dispatch({ type: 'CLOSE_ALERT' });
  };

  const pushAlert = (component: React.ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: AlertOptions) => {
    dispatch({ type: 'PUSH_ALERT', payload: { component, props, options } });
  };

  const popAlert = () => {
    dispatch({ type: 'POP_ALERT' });
  };

  const goToAlert = (index: number) => {
    dispatch({ type: 'GO_TO_ALERT', payload: { index } });
  };

  const clearStack = () => {
    dispatch({ type: 'CLEAR_STACK' });
  };

  return (
    <AlertContext.Provider value={{
      stack: state.stack,
      activeIndex: state.activeIndex,
      openAlert,
      closeAlert,
      pushAlert,
      popAlert,
      goToAlert,
      clearStack
    }}>
      {children}
    </AlertContext.Provider>
  );
}; 

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within AlertProvider');
  }
  return context;
}; 