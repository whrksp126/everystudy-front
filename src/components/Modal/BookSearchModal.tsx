import React, { useEffect, useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { IconArrowLeft, IconSearch } from '../../assets/Icon';
import SetMyBookModal from './SetMyBookModal';
import SetWorkBookModal from './SetWorkBookModal';
import { useData } from '../../contexts/DataContext';

const BookSearchStoreModal: React.FC = () => {
  const { 
    ebooksLoaded, getEbooks,
  } = useData();
  const [ebooks, setEbooks] = useState([]);

  const { pushModal, closeModal } = useModal();

  

  useEffect(() => {
    setEbooks(getEbooks());
  }, [ebooksLoaded]);

  const handleClose = () => {
    closeModal();
  };


  // 신규 교재 등록
  const handleNewBookRegistration = () => {
    console.log('신규 교재 등록');
    pushModal(SetMyBookModal, {}, { 
      preserveState: true, 
      keepInDOM: true 
    });
  };

  const handleSetWorkBook = (item: any) => {
    console.log('교재 등록', item);
    pushModal(SetWorkBookModal, {item}, { 
      preserveState: true, 
      keepInDOM: true 
    });
  };


  return (
    <div className="w-full max-w-[712px] max-h-[600px] rounded-[13px] bg-white shadow-xl overflow-hidden">
      {/* 헤더 */}
      <div className="relative flex items-center justify-between h-[64px] px-[20px]">
        <button
          onClick={handleClose}
          className="p-[4px]"
        >
          <IconArrowLeft width={32} height={32} className="text-gray-400" />
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-20b text-gray-800">
          <strong className="text-purple-400">1,225권</strong>의 교재가 준비되어있어요
        </h2>
        <button 
        onClick={handleNewBookRegistration}
        className="h-[40px] px-[14px] rounded-[6px] bg-primary-purple text-14m text-white"
        >
          신규 교재 등록
        </button>
      </div>
      {/* 메인 */}
      <div className="flex-1 overflow-y-auto max-h-[calc(600px-64px)]">
        {/* 검색 영역 */}
        <div className="flex items-center justify-between px-[20px] py-[15px]">
          <div className="relative flex-1">
            <input type="text" placeholder="교재를 검색하세요" className="w-full h-[48px] py-[13px] pl-[44px] pr-[16px] rounded-[10px] bg-gray-50 text-16m text-gray-800" />
            <IconSearch width={20} height={20} className="absolute left-[16px] top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {/* 교재 섹션들 */}
        {ebooks.map((section) => (
          <div key={section.id} className="flex flex-col gap-[12px] py-[12px]">
            <h2 className="px-[24px] text-16s text-black">{section.title}</h2>
            <div className="flex flex-wrap gap-[20px] pl-[20px]">
              {section.books.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handleSetWorkBook(item)}
                  className="flex flex-col gap-[12px] w-[160px] h-[264px] border border-gray-75 rounded-[8px] p-[10px] bg-gray-25"
                  >
                  <div className="flex items-center justify-center w-full h-[180px]">
                    <img src={item.image} alt="교재 이미지" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-13m text-gray-800 line-clamp-2">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default BookSearchStoreModal; 