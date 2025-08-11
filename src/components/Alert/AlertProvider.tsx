import React from 'react';
import { createPortal } from 'react-dom';
import { useAlertContext } from '../../contexts/AlertContext';

export const AlertProvider: React.FC = () => {
  const { stack, activeIndex } = useAlertContext();

  if (stack.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 bg-[#42424266] z-50 flex items-center justify-center backdrop-blur-[5px]">
      {stack.map((alert, index) => {
        const shouldRender = index === activeIndex || alert.options.keepInDOM;
        
        if (!shouldRender) return null;

        const AlertComponent = alert.component;
        
        return (
          <div
            key={alert.id}
            className={`absolute inset-0 flex items-center justify-center p-[17px] ${
              index === activeIndex ? 'block' : 'hidden'
            }`}
          >
            <AlertComponent {...alert.props} />
          </div>
        );
      })}
    </div>,
    document.body
  );
}; 