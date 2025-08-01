import React from 'react';
import Navigation from '../components/Navigation';
import { Sidebar } from 'phosphor-react';


interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <div className="fixed top-0 left-0 z-[9999] text-[#826FFF]">
        {/* 상단 상태바 영역 */}
        <div className="h-[24px]"></div>
        <div className="h-[44px] pl-[16px]">
          <Sidebar size={32} />
        </div>
      </div>
      <Navigation />
      {/* 태블릿/데스크톱: 좌측 여백 (md 이상), 모바일: 상하 여백 (md 미만) */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 