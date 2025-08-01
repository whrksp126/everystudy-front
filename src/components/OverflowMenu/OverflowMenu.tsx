import React, { useEffect, useState } from 'react';
import { useOverflowMenu } from '../../contexts/OverflowMenuContext';

const OverflowMenu: React.FC = () => {
  const { isOpen, triggerElement, menuContent, closeOverflowMenu } = useOverflowMenu();
  const [position, setPosition] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    if (isOpen && triggerElement) {
      const rect = triggerElement.getBoundingClientRect();
      const boxWidth = 120; // 기본 박스 너비
      const boxHeight = 120; // 기본 박스 높이
      
      let x, y;
      
      // 타겟 요소가 화면 중앙 기준으로 어느 쪽에 있는지 판단
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;
      
      // 좌우 배치 결정
      if (targetCenterX > screenCenterX) {
        // 타겟이 화면 우측에 있으면 좌측으로 메뉴 배치
        x = rect.left - boxWidth;
      } else {
        // 타겟이 화면 좌측에 있으면 우측으로 메뉴 배치
        x = rect.right;
      }
      
      // 상하 배치 결정
      if (targetCenterY > screenCenterY) {
        // 타겟이 화면 아래쪽에 있으면 위쪽으로 메뉴 배치
        y = rect.top - boxHeight - 8;
      } else {
        // 타겟이 화면 위쪽에 있으면 아래쪽으로 메뉴 배치
        y = rect.bottom + 8;
      }
      
      // 화면 오른쪽 경계 체크
      if (x + boxWidth > window.innerWidth) {
        x = rect.left - boxWidth;
      }
      
      // 화면 왼쪽 경계 체크
      if (x < 0) {
        x = rect.right;
      }
      
      // 화면 아래쪽 경계 체크
      if (y + boxHeight > window.innerHeight) {
        y = rect.top - boxHeight - 8;
      }
      
      // 화면 위쪽 경계 체크
      if (y < 0) {
        y = 8;
      }
      
      // 스크롤 값을 고려하여 절대 위치로 변환
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      setPosition({ 
        x: x + scrollX, 
        y: y + scrollY 
      });
    } else {
      // 닫기 시 위치 초기화
      setPosition({ x: -9999, y: -9999 });
    }
  }, [isOpen, triggerElement]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && triggerElement) {
        const target = event.target as Node;
        const menuElement = document.querySelector('[data-overflow-menu]');
        
        // 메뉴 내부 클릭이 아니고, 트리거 요소 클릭도 아닌 경우에만 닫기
        if (menuElement && !menuElement.contains(target) && !triggerElement.contains(target)) {
          closeOverflowMenu();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, triggerElement, closeOverflowMenu]);

  // 닫힌 상태면 렌더링하지 않음
  if (!isOpen || !triggerElement) return null;

  return (
    <div 
      className="absolute z-50 bg-white border border-gray-25 rounded-[8px] shadow-lg"
      style={{
        left: position.x,
        top: position.y,
      }}
      data-overflow-menu
    >
      {menuContent}
    </div>
  );
};

export default OverflowMenu; 