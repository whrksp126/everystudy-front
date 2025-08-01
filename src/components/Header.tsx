import React from 'react';

interface HeaderProps {
  title: string;
  HeaderLeftBtns: React.FC;
  HeaderRightBtns: React.FC;
}

const Header: React.FC<HeaderProps> = ({ title, HeaderLeftBtns, HeaderRightBtns }) => {
  return (
    <header className="relative flex items-center justify-between h-[44px]">
      <div className="flex items-center pl-[8px]">
        <HeaderLeftBtns />
      </div>
      <h1 className="absolute left-[50%] translate-x-[-50%] text-[18px] font-[700]">{title}</h1>
      <div className="pr-[16px]">
        <HeaderRightBtns />
      </div>
    </header>
  );
};

export default Header; 