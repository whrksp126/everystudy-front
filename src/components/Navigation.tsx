import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Exam, 
  Folder,
  BookBookmark
} from 'phosphor-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/workbook', label: '교재', icon: Folder },
    { path: '/wrongnote', label: '복습 문제', icon: BookBookmark },
    { path: '/exam', label: 'DIY 시험지', icon: Exam },
  ];

  return (
    <>
      {/* 태블릿/데스크톱: 좌측 사이드바 (md 이상) */}
      <nav className="hidden md:flex w-[320px] h-screen bg-[#F5F5F5] border-r border-[#c5c5c5]">
        <div className="flex flex-col w-full pl-[16px]">
          {/* 상단 상태바 영역 */}
          <div className="h-[24px]"></div>
          {/* 사이드바 토글 버튼 영역 */}
          <div className="h-[44px]"></div>
          {/* 로고 영역 */}
          <div className="flex items-center justify-start h-[50px] text-[32px] font-[700]">
            <h1>에브리스터디</h1>
          </div>
          
          {/* 네비게이션 메뉴 */}
          <div className="flex-1 pr-[16px]">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-[10px] h-[44px] px-[8px] rounded-[10px] transition-colors 
                    ${
                    isActive(item.path)
                      ? 'bg-[#EEE9FF]'
                      : ''
                    }
                  `}
                >
                  <IconComponent size={28} className={`${isActive(item.path) ? 'text-[#826FFF]' : 'text-[#130D0C]'}`} />
                  <span className="text-[18px] font-[400] text-[#130D0C]">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 모바일: 하단 네비게이션 (md 미만) */}
      <nav className="md:hidden fixed bottom-[0] left-[0] right-[0] bg-white border-t border-gray-200 z-[9999] shadow-lg h-16">
        <div className="flex justify-around items-center h-full px-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors min-w-0 ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                <IconComponent size={20} weight={isActive(item.path) ? "fill" : "regular"} />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation; 