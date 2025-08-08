import React from 'react';
import { IconEdit, IconDelete, IconArrowRightSquare } from '../assets/Icon.tsx';
import { useOverflowMenu } from '../contexts/OverflowMenuContext';
import { useModalContext } from '../contexts/ModalContext';
import SetFolderModal from './Modal/SetFolderModal';


interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ width: string; height: string; className: string }>;
  onClick: () => void;
  className?: string;
  iconClassName?: string;
  isDivider?: boolean;
}

const MyBookOverflowMenu: React.FC<{ item: any }> = ({ item }) => {
  const { closeOverflowMenu } = useOverflowMenu();
  const { pushModal } = useModalContext();

  const handleEdit = () => {
    console.log('편집 클릭');
    closeOverflowMenu();
    pushModal(SetFolderModal, {type: 'edit', item: item}, { 
      preserveState: true, 
      keepInDOM: true 
    });
  };

  const handleDelete = () => {
    console.log('삭제 클릭');
    closeOverflowMenu();
  };

  const handleMove = () => {
    console.log('이동 클릭');
    closeOverflowMenu();
  };

  const menuItems: MenuItem[] = [
    {
      id: 'edit',
      label: '편집',
      icon: IconEdit,
      onClick: handleEdit,
      className: 'text-gray-600',
      iconClassName: 'text-gray-400',
    },
    {
      id: 'move',
      label: '이동',
      icon: IconArrowRightSquare,
      onClick: handleMove,
      className: 'text-gray-600',
      iconClassName: 'text-gray-400',
    },
    {
      id: 'delete',
      label: '삭제',
      icon: IconDelete,
      onClick: handleDelete,
      className: 'text-red-500',
      iconClassName: 'text-red-500',
    },
  ];

  return (
    <div className="flex flex-col min-w-[140px] px-[12px] py-[4px] border border-gray-25 rounded-[4px] shadow-lg">
      {menuItems.map((item, index) => (
      <React.Fragment key={item.id}>
        <button
          onClick={item.onClick}
          className={`flex items-center gap-[4px] w-full py-[8px] hover:bg-gray-25 transition-colors ${item.className || ''}`}
        >
          <item.icon width="16" height="16" className={item.iconClassName || ''} />
          <span className="text-13m">{item.label}</span>
        </button>
        {menuItems.length - 1 !== index ? (
        <div className="h-[1px] bg-gray-90" />
        ) : (<></>)}
      </React.Fragment>
      ))}
    </div>
  );
};

export default MyBookOverflowMenu; 