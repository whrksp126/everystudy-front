import React, { useEffect, useState, useCallback } from 'react';
import { useModal } from '../../hooks/useModal';
import { IconArrowLeft, IconSearch, IconPaperFail, IconArrowRight4 } from '../../assets/Icon';
import SetMyBookModal from './SetMyBookModal';
import SetWorkBookModal from './SetWorkBookModal';
import { useData } from '../../contexts/DataContext';

const BookSearchStoreModal: React.FC = () => {
  const { 
    ebooksLoaded, getEbooks, getAllEbooks,
  } = useData();
  const [ebooks, setEbooks] = useState([]);
  const [allEbooks, setAllEbooks] = useState([]);
  const [eBookLibrary, setEBookLibrary] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');

  const { pushModal, closeModal } = useModal();

  

  useEffect(() => {
    // 모든 교재 호출
    setAllEbooks(getAllEbooks());
    // 카테고리 별 교재 호출
    setEBookLibrary(getEbooks());
    // 초기 화면 세팅
    setEbooks(getEbooks());
    
  }, [ebooksLoaded]);

  // 디바운싱: 검색어가 변경된 후 500ms 후에 실제 검색 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // 디바운스된 검색어로 실제 검색 실행
  useEffect(() => {
    if (debouncedSearchValue === '') {
      setIsSearch(false);
      setEbooks(eBookLibrary);
    } else {
      setIsSearch(true);
      const filteredEbooks = allEbooks.filter((item: any) => 
        item.title.toLowerCase().includes(debouncedSearchValue.toLowerCase())
      );
      setEbooks(filteredEbooks);
    }
  }, [debouncedSearchValue, allEbooks, eBookLibrary]);

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

  // 교재 선택
  const handleSetWorkBook = (item: any) => {
    console.log('교재 등록', item);
    pushModal(SetWorkBookModal, {item}, { 
      preserveState: true, 
      keepInDOM: true 
    });
  };

  // 검색어 입력 처리
  const handleSearchInput = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div 
      style={{maxHeight: 'min(600px, 90vh)',}}
      className="max-w-[712px] w-full h-full rounded-[13px] bg-white shadow-xl overflow-hidden"
      >
      {/* 헤더 */}
      <div className="relative flex items-center justify-between h-[64px] px-[20px]">
        <button
          onClick={handleClose}
          className="p-[4px]"
        >
          <IconArrowLeft width={32} height={32} className="text-gray-400" />
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-20b text-gray-800">
          <strong className="text-purple-400">{allEbooks.length}권</strong>의 교재가 준비되어있어요
        </h2>
        <button 
        onClick={handleNewBookRegistration}
        className="h-[40px] px-[14px] rounded-[6px] bg-primary-purple text-14m text-white"
        >
          신규 교재 등록
        </button>
      </div>
      {/* 메인 */}
      <div 
        className="flex-1 overflow-y-auto max-h-[calc(600px-64px)]"
        >
        {/* 검색 영역 */}
        <div className="flex items-center justify-between px-[20px] py-[15px]">
          <div className="relative flex-1">
            <input 
              value={searchValue}
              onChange={(e) => handleSearchInput(e.target.value)}
              type="text" 
              placeholder="교재를 검색하세요" 
              className="w-full h-[48px] py-[13px] pl-[44px] pr-[16px] rounded-[10px] bg-gray-50 text-16m text-gray-800" 
            />
            <IconSearch width={20} height={20} className="absolute left-[16px] top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {/* 교재 섹션들 */}
        {isSearch ? (
          ebooks.length > 0 ? (
            // 검색 결과가 있을 때
            <div className="flex flex-col gap-[12px] py-[12px]">
              <h2 className="px-[24px] text-16s text-black">"{searchValue}" 검색 결과</h2>
              <div className="flex flex-wrap gap-[20px] pl-[20px]">
                {ebooks.map((item: any) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleSetWorkBook(item)}
                    className="flex flex-col gap-[12px] w-[152px] h-[264px] border border-gray-75 rounded-[8px] p-[10px] bg-gray-25"
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
          ) : (
            // 검색 결과가 없을 때
            <div className="flex flex-col items-center justify-center gap-[80px] pt-[80px]">
              <div className="flex flex-col items-center justify-center gap-[12px]">
                <IconPaperFail width={120} height={120} className="text-gray-90" />
                <h2 className="text-18m text-gray-400 ">검색 결과가 없습니다</h2>
              </div>
              <button className="flex items-center justify-center gap-[12px] px-[14px] py-[12px] bg-primary-purple rounded-[6px]">
                <IconArrowRight4 width={16} height={16} className="text-purple-300" />
                <div className="flex flex-col items-start justify-center gap-[4px]">
                  <span className="text-14r text-white">
                    찾으시는 교재가 없나요?
                  </span>
                  <span className="text-14b text-white">
                    신규 교재 등록을 신청해주세요
                  </span>
                </div>
              </button>
            </div>
          )
        ) : (
          // 일반 섹션 표시
          ebooks.map((section: any) => (
            <div key={section.id} className="flex flex-col gap-[12px] py-[12px]">
              <h2 className="px-[24px] text-16s text-black">{section.title}</h2>
              <div className="flex flex-wrap gap-[20px] pl-[20px]">
                {section.books.map((item: any) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleSetWorkBook(item)}
                    className="flex flex-col gap-[12px] w-[152px] h-[264px] border border-gray-75 rounded-[8px] p-[10px] bg-gray-25"
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
          ))
        )}
        
      </div>


    </div>
  );
};

export default BookSearchStoreModal; 