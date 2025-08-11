import React from 'react';
import { createPortal } from 'react-dom';
import { useModalContext } from '../../contexts/ModalContext';

export const ModalProvider: React.FC = () => {
  const { stack, activeIndex } = useModalContext();

  if (stack.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 bg-[#42424266] z-50 flex items-center justify-center backdrop-blur-[5px]">
      {stack.map((modal, index) => {
        const shouldRender = index === activeIndex || modal.options.keepInDOM;
        
        if (!shouldRender) return null;

        const ModalComponent = modal.component;
        
        return (
          <div
            key={modal.id}
            className={`
              absolute inset-0 flex items-center justify-center 
              ${index === activeIndex ? 'block' : 'hidden'}
              ${modal.options.smFull ? '': 'px-[17px]'}
            `}
          >
            <ModalComponent {...modal.props} />
          </div>
        );
      })}
    </div>,
    document.body
  );
}; 