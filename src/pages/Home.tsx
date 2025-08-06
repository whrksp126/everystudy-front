import React, { useState, useEffect, useRef } from 'react';
import EveryStudyLogo from '../assets/EveryStudyLogo.png';
import MyBookOverflowMenu from '../components/MyBookOverflowMenu';
import OverflowMenu from '../components/OverflowMenu/OverflowMenu.js';
import { useOverflowMenu } from '../contexts/OverflowMenuContext';
import { useModal } from '../hooks/useModal'
import BookSearchModal from '../components/Modal/BookSearchModal';
import { useData } from '../contexts/DataContext';
import SetFolderModal from '../components/Modal/SetFolderModal';

import { 
  IconPlus, 
  IconProfile, 
  IconTimeCircle, 
  IconEditSquare, 
  IconDocument, 
  IconArrowRight4, 
  IconCategory, 
  IconList, 
  IconChevronUp, 
  IconChevronDown, 
  IconKebab,
} from '../assets/Icon.jsx';

const sortOptions = [
  '최근 등록순',
  '최근 학습순', 
  '제목순'
];


const Home: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('최근 등록순');
  const [viewMode, setViewMode] = useState<'category' | 'list'>('category');
  const { openOverflowMenu } = useOverflowMenu();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModal();

  const [recentStudyBooks, setRecentStudyBooks] = useState<any[]>([]);
  const [reviewNotes, setReviewNotes] = useState<any[]>([]);
  const [vocabs, setVocabs] = useState<any[]>([]);
  const [myDocs, setMyDocs] = useState<any[]>([]);

  const { 
    myDocsLoaded, getMyDocs,
    vocabsLoaded, getVocabs,
    reviewNotesLoaded, getReviewNotes,
  } = useData();


  useEffect(() => {
    if(myDocsLoaded && reviewNotesLoaded && vocabsLoaded ){

      const myDocsData = getMyDocs();
      const sortedMyDocs = sortMyDocs(selectedSort, myDocsData);
      setMyDocs(sortedMyDocs || []);
      setRecentStudyBooks(filterRecentLearningDocs(myDocsData));
      setVocabs(getVocabs());
      setReviewNotes(getReviewNotes());
    }
  }, [myDocsLoaded, reviewNotesLoaded, vocabsLoaded]);

  // 최근 공부한 교재 필터링
  const filterRecentLearningDocs = (myDocs) => {
    return myDocs
      .filter(doc => !doc.isFolder) 
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  };

  // 내 교재 정렬
  const sortMyDocs = (option: string, sortItems: any[]) => {
    if(option === '최근 등록순'){
      return sortItems
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } else if(option === '최근 학습순'){
      return sortItems
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    } else if(option === '제목순'){
      return sortItems
        .sort((a, b) => a.title.localeCompare(b.title))
    }
  };
  
  const handleSortChange = (option: string) => {
    setSelectedSort(option);
    setIsDropdownOpen(false);

    const sortedMyDocs = sortMyDocs(option, myDocs);
    setMyDocs(sortedMyDocs || []);
  };

  const handleMoreOptionsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    openOverflowMenu(event.currentTarget as HTMLElement, <MyBookOverflowMenu />);
  };

  const handleBookRegistration = () => {
    openModal(BookSearchModal, {}, { 
      preserveState: true, 
      keepInDOM: true 
    });
  };

  const handleFolderRegistration = () => {
    openModal(SetFolderModal, {}, { 
      preserveState: true, 
      keepInDOM: true 
    });
  }

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* 상단 상태바 영역 */}
      <div className="h-[24px] bg-gray-50"></div>

      {/* GNB */}
      <div className="flex justify-between items-center w-full h-[72px] px-[24px] pt-[12px] pb-[20px] bg-gray-50">
        <div className="">
          {/* 태블릿 로고 */}
          <img src={EveryStudyLogo} alt="EveryStudyLogo" className="h-[20px]" />
          {/* 모바일 더보기 버튼*/}

        </div>
        <div className="flex items-center gap-[12px]">
          {/* 교재 추가하기 버튼 */}
          <button 
            onClick={handleBookRegistration}
            className="flex items-center gap-[6px] h-[40px] px-[14px] rounded-[6px] bg-white"
            >
            <IconPlus width="16" height="16" className="text-gray-300" />
            <span className="text-14m text-gray-500">교재 추가하기</span>
          </button>
          {/* 내 학습 버튼 */}
          <button className="flex items-center gap-[6px] h-[40px] px-[14px] rounded-[6px] bg-primary-purple">
            <IconProfile width="16" height="16" className="text-white" />
            <span className="text-14m text-white">내 학습</span>
          </button>
        </div>
      </div>

      {/* SECTION */}
      <div className="grid grid-cols-3 gap-[16px] px-[40px] py-[24px] bg-gray-50">
        {/* 최근 공부한 교재 */}
        <div className="flex flex-1 flex-col gap-[12px] h-[324px] px-[24px] py-[20px] rounded-[10px] bg-white">
          {/* 제목 */}
          <div>
            <div className="flex items-center gap-[8px]">
              <IconTimeCircle width="20" height="20" className="text-primary-purple" />
              <h2 className="text-18s text-primary-purple">최근 공부한 교재</h2>
            </div>
            <div></div>
          </div>
          {/* 컨텐츠 */}
          <div className="flex gap-[12px]">
          {recentStudyBooks.slice(0, 2).map((book) => (
            <div
              key={book.id}
              className="flex flex-col gap-[12px] justify-end h-[248px] p-[10px] border border-gray-75 rounded-[8px]"
            >
              <img src={book.image} alt="교재 이미지" />
              <h3 className="h-[36px] text-13m text-gray-800 line-clamp-2">{book.title}</h3>
            </div>
          ))}
          </div>
        </div>
        {/* 복습 */}
        <div className="flex flex-1 flex-col gap-[12px] h-[324px] px-[24px] py-[20px] rounded-[10px] bg-white">
          {/* 제목 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[8px]">
              <IconEditSquare width="20" height="20" className="text-gray-800" />
              <h2 className="text-18s text-gray-800">복습</h2>
            </div>
            <div className="flex items-center gap-[8px]">
              <IconArrowRight4 width="24" height="24" className="text-gray-400" />
            </div>
          </div>
          {/* 컨텐츠 */}
          <div className="flex gap-[12px]">
            {reviewNotes.map((item) => (
            <div key={item.id} className="flex flex-1 flex-col gap-[12px] justify-end h-[248px] p-[10px] border border-gray-75 rounded-[8px]">
              <img src={item.image} alt="교재 이미지" />
              <h3 className="h-[36px] text-13m text-gray-800 line-clamp-2">{item.title}</h3>
            </div>
            ))}
          </div>
        </div>
        {/* 단어장 */}
        <div className="flex flex-col gap-[12px] h-[324px] px-[24px] py-[20px] rounded-[10px] bg-white">
          {/* 제목 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[8px]">
              <IconDocument width="20" height="20" className="text-gray-800" />
              <h2 className="text-18s text-gray-800">단어장</h2>
            </div>
            <div className="flex items-center gap-[8px]">
              <IconArrowRight4 width="24" height="24" className="text-gray-400" />
            </div>
          </div>
          {/* 컨텐츠 */}
          <div className="flex flex-col gap-[8px]">
            {vocabs.map((item) => (
              <div key={item.id} className="flex justify-between items-center px-[12px] py-[14px] rounded-[12px] bg-gray-25">
                <div className="flex flex-col gap-[8px]">
                  <span className="text-13m text-gray-800">{item.title}</span>
                  <div className="">
                    <span className="mr-[8px] text-16b text-gray-800">{item.englishWord}</span>
                    <span className="text-16b text-gray-200">{item.koreanWord}</span>
                  </div>
                </div>
                <div className="px-[8px] py-[3px] rounded-[6px] bg-gray-50 px-[12px] py-[6px] text-12r text-gray-600">단어 <strong className="text-primary-purple">{item.wordCount}</strong>개</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col gap-[32px] px-[60px] py-[24px] bg-white">
        {/* header */}
        <div className="flex justify-between items-center pb-[20px] border-b border-gray-90">
          <div className="flex items-center gap-[20px]">
            <h2 className="text-20b text-black">내 교재</h2>
            <div className="flex items-center gap-[12px]">
              <button 
                onClick={handleBookRegistration}
                className="flex items-center gap-[6px] h-[40px] px-[14px] rounded-[6px] bg-gray-50"
              >
                <IconPlus width="16" height="16" className="text-gray-300" />
                <span className="text-14m text-gray-500">새 교재</span>
              </button>
              <button 
                onClick={handleFolderRegistration}
                className="flex items-center gap-[6px] h-[40px] px-[14px] rounded-[6px] bg-gray-50"
              >
                <IconPlus width="16" height="16" className="text-gray-300" />
                <span className="text-14m text-gray-500">새 폴더</span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-[20px]">
            {/* 드롭다운 버튼 */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center min-w-[120px] h-[40px] pl-[16px] pr-[4px] rounded-[6px] bg-gray-25 hover:bg-gray-50 transition-colors"
              >
                <span className="flex-1 text-14r text-gray-600 text-start">{selectedSort}</span>
                <div className="p-[8px]">
                  {isDropdownOpen ? (
                    <IconChevronUp width="16" height="16" className="text-gray-200" />
                  ) : (
                    <IconChevronDown width="16" height="16" className="text-gray-200" />
                  )}
                </div>
              </button>
              
              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-[8px] min-w-[120px] w-full border border-gray-25 rounded-[4px] p-[8px] bg-white shadow-md z-10">
                  {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`
                      w-full h-[40px] px-[10px] py-[8px] text-14m text-left hover:bg-gray-25 transition-colors rounded-[4px]
                      ${
                      selectedSort === option ? 'text-primary-purple bg-gray-50' : 'text-gray-600'
                      }
                    `}
                  >
                    {option}
                  </button>
                  ))}
                </div>
              )}
            </div>
            {/* 토글 버튼 */}
            <div className="flex items-center gap-[12px]">
              <button onClick={() => setViewMode('category')}>
                <IconCategory 
                  width="28" 
                  height="28" 
                  className={viewMode === 'category' ? 'text-primary-purple' : 'text-gray-300'} 
                />
              </button>
              <div className="h-[24px] w-[1px] bg-gray-90"></div>
              <button onClick={() => setViewMode('list')}>
                <IconList 
                  width="28" 
                  height="28" 
                  className={viewMode === 'list' ? 'text-primary-purple' : 'text-gray-300'} 
                />
              </button>
            </div>
          </div>
        </div>
        {/* 컨텐츠 */}
        {viewMode === 'category' ? (
        <div className="flex flex-wrap gap-[20px]">
          {myDocs.map((item) => (
            <div key={item.id} className="flex flex-col gap-[12px] w-[160px] h-[264px] border border-gray-75 rounded-[8px] p-[10px] bg-gray-25">
              <div className="flex items-center justify-center w-full h-[180px]">
                {item.isFolder ? (
                  <item.folderIcon width="120" height="100" className="text-gray-200" />
                ) : (
                  <img src={item.image || ''} alt="교재 이미지" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-13m text-gray-800 line-clamp-2">{item.title}</h3>
                <button onClick={handleMoreOptionsClick}>
                  <IconKebab width="24" height="24" className="text-gray-200" />
                </button>
              </div>
            </div>
          ))}
        </div>
        ) : (
        <div className="flex flex-col gap-[16px]">
        {myDocs.map((item) => (
          <div key={item.id} className="flex gap-[12px] h-[100px] border border-gray-75 rounded-[8px] p-[10px] bg-gray-25">
            <div className="flex items-center justify-center w-[62px] h-[80px]">
              {item.isFolder ? (
                <item.folderIcon width="42" height="35" className="text-gray-200" />
              ) : (
                <img src={item.image || ''} alt="교재 이미지" />
              )}
            </div>
            <div className="flex items-center justify-between flex-1">
              <h3 className="text-13m text-gray-800 line-clamp-2">{item.title}</h3>
              <button onClick={handleMoreOptionsClick}>
                <IconKebab width="24" height="24" className="text-gray-200" />
              </button>
            </div>
          </div>
        ))}
        </div>
        )}
        </div>
      
      {/* 오버플로우 메뉴 컴포넌트 */}
      <OverflowMenu />
    </div>
  );
};

export default Home; 