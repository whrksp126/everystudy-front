import React, { useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { IconArrowLeft, IconUpload } from '../../assets/Icon';
import { useAlert } from '../../hooks/useAlert';
import WarringNoWorkBookAlert from '../Alert/WarringNoWorkBookAlert';


const SetWorkBookModal: React.FC<{item: any}> = ({item}) => {
  const { popModal, closeModal } = useModal();
  const { openAlert } = useAlert();
  const handleClose = () => {
    popModal();
  };

  const handleSave = () => {
    openAlert(WarringNoWorkBookAlert, {
      preserveState: true, 
      keepInDOM: true 
    });
  };

  return (
    <div className="w-full max-w-[712px] max-h-[600px] pb-[32px] rounded-[13px] bg-white shadow-xl overflow-hidden">
      {/* 헤더 */}
      <div className="relative flex items-center justify-between h-[64px] px-[20px]">
        <button
          onClick={handleClose}
          className="p-[4px]"
        >
          <IconArrowLeft width={32} height={32} className="text-gray-400" />
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-20b text-gray-800">
          직접 교재를 등록해보세요
        </h2>
      </div>
      {/* 메인 */}
      <div className="flex flex-col gap-[20px] flex-1 max-h-[calc(600px-64px-84px)] py-[24px] overflow-y-auto">

        <div className="px-[32px]">
          <div className="flex gap-[24px] px-[20px] py-[16px]  rounded-[10px] bg-gray-25">
            {/* 썸네일 */}
            <div>
              <img src={item.image} alt="교재 썸네일" className="w-[120px] h-[160px] rounded-[10px]" />
            </div>
            {/* 교재 정보 */}
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[12px]">
                {/* 태그 */}
                <div className="flex gap-[8px]">
                  {item.tags.map((tag: any) => (
                  <span key={tag.name} className={`px-[8px] py-[3px] rounded-[6px] text-12r ${tag.color === 'purple' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'}`}>{tag.name}</span>
                  ))}
                </div>
                {/* 교재명 */}
                <h3 className="text-20b text-black">
                  {item.title}
                </h3>
              </div>
              
              <div className="flex flex-col gap-[6px]">
                {/* 영역 */}
                <div className="flex items-center gap-[4px]">
                  <h4 className="w-[50px] h-[20px] text-15m text-black">영역</h4>
                  <span className="text-15m text-gray-400">{item.area}</span>
                </div>
                {/* 출판사 */}
                <div className="flex items-center gap-[4px]">
                  <h4 className="w-[50px] h-[20px] text-15m text-black">출판사</h4>
                  <span className="text-15m text-gray-400">{item.publisher}</span>
                </div>
                {/* 발행일 */}
                <div className="flex items-center gap-[4px]">
                  <h4 className="w-[50px] h-[20px] text-15m text-black">발행일</h4>
                  <span className="text-15m text-gray-400">{item.releaseDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-[16px] px-[32px]">
          {item.files.pdf.map((file: any, index: number) => (
          <div key={`pdf-${index}`} className="flex flex-col flex-1 gap-[12px]">
            <h3 className="text-16s text-black">{file.title}</h3>
            <div className="flex flex-col items-center justify-center gap-[12px] flex-1 min-h-[148px] px-[20px] border border-gray-75 rounded-[10px] bg-gray-25 text-16m text-gray-400">
              <IconUpload width={32} height={32} className="text-gray-200" />
              <span className="text-center text-16r text-gray-400">PDF 파일을<br />업로드 해주세요.</span>
            </div>
          </div>
          ))}
          {item.files.audio.map((file: any, index: number) => (
          <div key={`audio-${index}`} className="flex flex-col flex-1 gap-[16px]">
            <h3 className="text-16s text-black">{file.title}</h3>
            <div className="flex flex-col items-center justify-center gap-[12px] flex-1 min-h-[148px] px-[20px] border border-gray-75 rounded-[10px] bg-gray-25 text-16m text-gray-400">
              <IconUpload width={32} height={32} className="text-gray-200" />
              <span className="text-center text-16r text-gray-400">PDF 파일을<br />업로드 해주세요.</span>
            </div>       
          </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button 
          onClick={handleSave}
          className="w-[240px] h-[52px] rounded-[8px] bg-primary-purple text-16s text-white"
        >등록하기</button>
      </div>


    </div>
  );
};

export default SetWorkBookModal; 