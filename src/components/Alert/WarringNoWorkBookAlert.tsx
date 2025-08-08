import React from 'react';
import { IconDangerCircle } from '../../assets/Icon';
import { useAlert } from '../../hooks/useAlert';
import { useModal } from '../../hooks/useModal';

const WarringNoWorkBookAlert: React.FC = () => {
  const { popAlert, closeAlert } = useAlert();
  const { popModal, closeModal } = useModal();

  const handleClose = () => {
    popAlert();
  };

  const handleSave = () => {
    closeAlert();
  };

  return (
    <div className="w-full max-w-[360px] pb-[20px] rounded-[13px] bg-white shadow-xl overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-[12px] py-[60px]">
        <IconDangerCircle  width={40} height={40} className="text-gray-200" />
        <h3 className="text-18s text-black">문제집 파일을 등록해주세요</h3>
      </div>

      {/* 메인 */}
      <div className="flex items-center justify-center">
        <button 
          onClick={handleSave}
          className="w-[160px] h-[52px] rounded-[8px] bg-primary-purple text-16s text-white"
        >확인</button>
      </div>


    </div>
  );
};

export default WarringNoWorkBookAlert; 