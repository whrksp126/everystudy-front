import React, { useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { IconX } from '../../assets/Icon';


const SetFolderModal: React.FC = () => {
  const { popModal, closeModal } = useModal();
  const [selectedColor, setSelectedColor] = useState('1');

  // 폴더 색상 데이터
  const folderColors = [
    { id: '1', value: '#67cdff' },
    { id: '2', value: '#717171' },
    { id: '3', value: '#1C82F6' },
    { id: '4', value: '#59D878' },
    { id: '5', value: '#FFDC4B' },
    { id: '6', value: '#FF625A' },
    { id: '7', value: '#7568F1' },
  ];


  const handleClose = () => {
    popModal();
  };

  const handleSave = () => {
    console.log('저장');
    popModal();
  };

  return (
    <div className="w-full max-w-[360px] pb-[32px] rounded-[13px] bg-white shadow-xl overflow-hidden">
      {/* 헤더 */}
      <div className="relative flex items-center justify-between h-[64px] pr-[20px] pl-[16px]">
        <button
          onClick={handleClose}
          className="px-[16px] py-[8px] text-18m text-primary-purple"
        >
          취소
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-20b text-gray-800">
          폴더 설정
        </h2>
        <button
          onClick={handleSave}
          className="h-[40px] px-[14px] rounded-[6px] bg-primary-purple text-14m text-white"
        >
          저장
        </button>
      </div>
      {/* 메인 */}
      <div className="flex flex-col gap-[12px] flex-1 px-[20px] overflow-y-auto">
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-16s text-black">폴더명</h3>
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="폴더명을 입력하세요." 
              value="이름 없음" 
              className="w-full h-[48px] py-[13px] pl-[16px] pr-[45px] rounded-[10px] bg-gray-50 text-16m text-gray-800" 
            />
            <div className="absolute right-[12px] top-1/2 -translate-y-1/2 p-[8px]">
              <IconX width={16} height={16} className="text-gray-200" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-16s text-black">폴더 색상</h3>
          <div className="flex items-center gap-[10px] p-[5px]">
            {folderColors.map((color) => (
              <button
                key={`color-${color.id}`}
                onClick={() => setSelectedColor(color.id)}
                className={`flex items-center justify-center w-[36px] h-[36px] border border-[3px] rounded-[20px] bg-white transition-all ${
                  selectedColor === color.id 
                    ? 'border-primary-purple' 
                    : 'border-white'
                }`}
              >
                <div 
                  className="w-[26px] h-[26px] rounded-[20px]" 
                  style={{ backgroundColor: color.value }}
                ></div>
              </button>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default SetFolderModal; 