import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import EveryStudyLogo from '../assets/EveryStudyLogo.png';
import MyBookOverflowMenu from '../components/MyBookOverflowMenu';
import OverflowMenu from '../components/OverflowMenu/OverflowMenu';
import { useOverflowMenu } from '../contexts/OverflowMenuContext';
import { useModal } from '../hooks/useModal'
import BookSearchModal from '../components/Modal/BookSearchModal';
import { useData } from '../contexts/DataContext';
import SetFolderModal from '../components/Modal/SetFolderModal';

import {getFolderSvg} from '../utils/folderSvg';
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
  IconArrowLeft7,
  IconMenu,
} from '../assets/Icon.tsx';
import { moveFolderfetch } from '../api/myDocs';

// ---------------- Helper Types/Functions ----------------
type TreeItem = any;

// 폴더 아이템 찾기
const findParentFolderId = (items: TreeItem[], targetId: string, parentId: string | null = null): string | null => {
  for (const it of items || []) {
    if (it.id === targetId) return parentId;
    if (it.type === 'folder' && Array.isArray(it.items)) {
      const found = findParentFolderId(it.items, targetId, it.id);
      if (found !== null) return found;
    }
  }
  return null;
};


// 현재 폴더 아이디 조회
const getCurrentFolderIdFromPath = (folderPath: string[]): string | null => (
  folderPath.length > 0 ? folderPath[folderPath.length - 1] : null
);

type MoveIntent = { itemId: string; fromFolderId: string | null; toFolderId: string | null } | null;

// 이동 의도 계산
const computeMoveIntent = (
  root: TreeItem[] | null | undefined,
  folderPath: string[],
  activeItemSafe: any,
  overItemSafe: any
): MoveIntent => {
  console.log('root', root);
  console.log('folderPath', folderPath);
  console.log('activeItemSafe', activeItemSafe);
  console.log('overItemSafe', overItemSafe);
  if (!Array.isArray(root)) return null;
  const sourceId: string | undefined = activeItemSafe?.item?.id ?? activeItemSafe?.id ?? activeItemSafe?.item_id;
  if (!sourceId) return null;

  const fromFolderId = findParentFolderId(root, sourceId, null);
  const toFolderId = overItemSafe?.item?.type === 'folder'
    ? (overItemSafe.item.id as string)
    : getCurrentFolderIdFromPath(folderPath);

  console.log('fromFolderId', fromFolderId);
  console.log('toFolderId', toFolderId);

  // 자기 자신 폴더에 드롭하는 경우는 null 반환
  if (
    overItemSafe?.item?.type === 'folder' &&
    (overItemSafe.item.id === sourceId)
  ) {
    return null;
  }

  if (fromFolderId === toFolderId) return null;
  return { itemId: sourceId, fromFolderId, toFolderId };
};

// DnD/UX 지연값 상수 (한 곳에서 관리)
const DRAG_ACTIVATION_DELAY_MS = 1000; // 롱프레스 시간
const HOVER_ENTER_MS = 2000; // 폴더/뒤로가기 진입 대기 시간

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

  const [viewMyDocs, setViewMyDocs] = useState<any[]>([]);
  const [folderPath, setFolderPath] = useState<string[]>([]);


  const { 
    myDocsLoaded, getMyDocs, myDocs, setUpdateMyDocsFolderMove,
    vocabsLoaded, getVocabs,
    reviewNotesLoaded, getReviewNotes,
    
  } = useData() as any;


  // 최근 학습 데이터 업데이트
  useEffect(() => {
    if(myDocsLoaded){
      setRecentStudyBooks(filterRecentLearningDocs(myDocs));
    }
  }, [myDocsLoaded, myDocs]);

  // 복습 데이터 업데이트
  useEffect(() => {
    if(reviewNotesLoaded){
      setReviewNotes(getReviewNotes());
    }
  }, [reviewNotesLoaded ]);

  // 단어장 데이터 업데이트
  useEffect(() => {
    if(vocabsLoaded){
      setVocabs(getVocabs());
    }
  }, [vocabsLoaded]);


  // 내 교재 영역 변경
  useEffect(()=>{
    if(myDocsLoaded){
      let currentItems = getMyDocs();
      for (const folderId of folderPath) {
        const foundFolder = currentItems.find((item: any) => item.type === 'folder' && item.id === folderId);
        if (foundFolder && foundFolder.items) {
          currentItems = foundFolder.items;
        } else {
          currentItems = [];
          break;
        }
      }
      const sortedItems = sortMyDocs(currentItems);
      setViewMyDocs(sortedItems || []);
    }
  },[myDocsLoaded, myDocs, folderPath, selectedSort])
  
  // 최근 공부한 교재 필터링
  const filterRecentLearningDocs = (myDocs: any[]) => {
    return myDocs
      .filter((doc: any) => doc.type !== 'folder') 
      .sort((a: any, b: any) =>  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  };

  // 내 교재 정렬
  const sortMyDocs = (sortItems: any[]) => {
    const option = selectedSort || '최근 등록순';
    if(option === '최근 등록순'){
      return sortItems
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if(option === '최근 학습순'){
      return sortItems
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    } else if(option === '제목순'){
      return sortItems
        .sort((a: any, b: any) => {
          const getName = (item: any) => item.type === 'folder' ? item.name : item.title;
          return getName(a).localeCompare(getName(b));
        })
    }
  };
  
  // 정렬 옵션 변경
  const handleSortChange = (option: string) => {
    setSelectedSort(option);
    setIsDropdownOpen(false);
    const sortedMyDocs = sortMyDocs(getMyDocs());
    setViewMyDocs(sortedMyDocs || []);
  };

  // 아이템 ... 더보기 버튼 클릭
  const handleMoreOptionsClick = (event: React.MouseEvent, item: any) => {
    event.stopPropagation();
    openOverflowMenu(event.currentTarget as HTMLElement, <MyBookOverflowMenu item={item} />);
  };

  // 교재 추가
  const handleBookRegistration = () => {
    openModal(BookSearchModal, {}, { 
      preserveState: true, 
      keepInDOM: true,
      smFull: true,
    });
  };

  // 폴더 추가
  const handleFolderRegistration = () => {
    openModal(SetFolderModal, { type: 'add', folderPath: folderPath }, { 
      preserveState: true, 
      keepInDOM: true,
      smFull: false,
    });
  }

  // 아이템 클릭
  const handleClickItem = (item: any) => {
    if(item.type === 'folder'){
      setFolderPath([...folderPath, item.id]);
    }

    if(item.type === 'workbook'){
      window.location.href = `/learning?testType=WORK_BOOK&workbook_id=${item.id}`;
    }
    if(item.type === 'mybook'){
      window.location.href = `/learning?testType=MY_WORKBOOK&workbook_id=${item.id}`;
    }
  }

  // 폴더 뒤로가기
  const handleClickBackFolder = () => {
    if (folderPath.length > 0) {
      setFolderPath(prev => prev.slice(0, prev.length - 1));
    }
  }

  // 폴더 이름 찾기
  const findFolderName = (folderPath: string[]) => {
    let currentItems = getMyDocs();
    let folderName = '';
    for (const folderId of folderPath) {
      const foundFolder = currentItems.find((item: any) => item.type === 'folder' && item.id === folderId);
      if (foundFolder) {
        folderName = foundFolder.name;
        currentItems = foundFolder.items || [];
      } else {
        folderName = '';
        break;
      }
    }
    return folderName;
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

  // DragOverlay 렌더 대상 및 hover 감지 상태/타이머
  const [activeDragItem, setActiveDragItem] = useState<any | null>(null);
  const [overFolderId, setOverFolderId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const backHoverTimeoutRef = useRef<number | null>(null);
  // 드래그 세션 동안 초기 선택/마지막 over 대상 유지 (리렌더로 e.over가 사라지는 경우 대비)
  const activeDragDataRef = useRef<any | null>(null);
  const lastOverRef = useRef<{ id: string | undefined; data: any } | null>(null);

  // 타이머 정리 유틸
  const clearHoverTimer = useCallback(() => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  // 뒤로가기 타이머 정리
  const clearBackHoverTimer = useCallback(() => {
    if (backHoverTimeoutRef.current) {
      window.clearTimeout(backHoverTimeoutRef.current);
      backHoverTimeoutRef.current = null;
    }
  }, []);

  // 진입 동작 큐잉
  const queueFolderEnter = useCallback((folderId: string) => {
    if (overFolderId === folderId) return;
    setOverFolderId(folderId);
    clearHoverTimer();
    hoverTimeoutRef.current = window.setTimeout(() => {
      setFolderPath(prev => [...prev, folderId]);
      setOverFolderId(null);
      clearHoverTimer();
    }, HOVER_ENTER_MS);
  }, [overFolderId, clearHoverTimer]);

  // 뒤로가기 타이머 정리
  const queueBackEnter = useCallback(() => {
    if (folderPath.length === 0 || backHoverTimeoutRef.current) return;
    clearHoverTimer();
    backHoverTimeoutRef.current = window.setTimeout(() => {
      setFolderPath(prev => prev.slice(0, prev.length - 1));
      clearBackHoverTimer();
    }, HOVER_ENTER_MS);
  }, [folderPath.length, clearBackHoverTimer, clearHoverTimer]);

  // DnD 이벤트 핸들러
  const handleDragStart = useCallback((e: DragStartEvent) => {
    const data: any = e.active.data.current;
    setActiveDragItem(data?.item || null);
    activeDragDataRef.current = data?.item || null;
  }, []);

  // 드래그 오버 이벤트 핸들러
  const handleDragOver = useCallback(async (e: DragOverEvent) => {
    const overId = e.over?.id as string | undefined;
    const overData: any = e.over?.data?.current;
    // 마지막 over 대상 저장 (리렌더로 e.over가 순간적으로 없어지는 케이스 대비)
    lastOverRef.current = { id: overId, data: overData };

    // 1) 뒤로가기 우선 처리
    if (overId === 'back-area') {
      queueBackEnter();
      return;
    }

    // 2) 뒤로가기 타이머 정리
    clearBackHoverTimer();

    // 3) 폴더 진입 처리
    if (overData?.item?.type === 'folder') {
      queueFolderEnter(overData.item.id);
      return;
    }
    // 4) 기타 영역: 모든 타이머 정리
    setOverFolderId(null);
    clearHoverTimer();
  }, [queueBackEnter, clearBackHoverTimer, queueFolderEnter, clearHoverTimer]);

  // 드래그 종료 이벤트 핸들러
  const handleDragEnd = useCallback(async (e: DragEndEvent) => {
    setActiveDragItem(null);
    setOverFolderId(null);
    clearHoverTimer();
    clearBackHoverTimer();
    const activeItemSafe = activeDragDataRef.current ?? e.active?.data?.current ?? null;
    const overItemSafe = lastOverRef.current?.data ?? e.over?.data?.current ?? null;
    activeDragDataRef.current = null;
    lastOverRef.current = null;
    const intent = computeMoveIntent(getMyDocs(), folderPath, activeItemSafe, overItemSafe);
    if (!intent) {
      console.log('no-op: same parent or invalid intent');
      return;
    }

    try{
      await moveFolderfetch({ itemId: intent.itemId, toFolderId: intent.toFolderId || ''});
      setUpdateMyDocsFolderMove({...intent})
    }catch(error){
      console.error(error);
    }

  }, [clearBackHoverTimer, clearHoverTimer, folderPath, getMyDocs]);

  return (
    <div className="flex flex-col">
      {/* 상단 상태바 영역 */}
      <div className="h-[24px] bg-gray-50"></div>

      {/* GNB */}
      <div className="
        flex justify-between items-center w-full h-[72px] px-[24px] pt-[12px] pb-[20px] bg-gray-50
        max-sm:h-[64px] max-sm:pb-[12px]
      ">
        <div className="">
          {/* 태블릿 로고 */}
          <img src={EveryStudyLogo} alt="EveryStudyLogo" className="
            h-[20px]
            max-sm:hidden
          " />
          {/* 모바일 더보기 버튼*/}
          <button className="
            flex items-center gap-[6px] rounded-[6px] bg-gray-50 hidden
            max-sm:flex
          ">
            <IconMenu width="24" height="24" className="text-black" />
          </button>

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
      <div className="grid grid-cols-6 gap-[16px] px-[40px] py-[24px] bg-gray-50 max-sm:hidden">
        {/* 최근 공부한 교재 */}
        <div className="
          col-span-2 flex flex-1 flex-col gap-[12px] h-[324px] px-[24px] py-[20px] rounded-[10px] bg-white 
          max-lg:col-span-3">
          {/* 제목 */}
          <div>
            <div className="flex items-center gap-[8px]">
              <IconTimeCircle width="20" height="20" className="text-primary-purple" />
              <h2 className="text-18s text-primary-purple">최근 공부한 교재</h2>
            </div>
            <div></div>
          </div>
          {/* 컨텐츠 */}
          {recentStudyBooks.length === 0 ? (
            <div className="flex items-center justify-center flex-1 h-[248px] p-[12px] rounded-[12px] bg-gray-25">
              <span className="text-18m text-gray-400 text-center">최근 공부한 교재가 없습니다.</span>
            </div>
          ) : (
            <div className="flex gap-[12px]">
            {recentStudyBooks.slice(0, 2).map((book) => (
              <div
                key={book.id}
                className="flex flex-col gap-[12px] justify-end flex-1 h-[248px] p-[10px] border border-gray-75 rounded-[8px]"
              >
                <div className="flex items-center justify-center w-full h-[180px]">
                  <img
                    src={book.cover_img || ''}
                    alt="교재 이미지"
                    className="max-w-full max-h-full w-[100%] h-[100%] object-contain"
                  />
                </div>
                <h3 className="h-[36px] text-13m text-gray-800 line-clamp-2">{book.title}</h3>
              </div>
            ))}
            </div>  
          )}
          
        </div>
        {/* 복습 */}
        <div className="
          col-span-2 flex flex-1 flex-col gap-[12px] h-[324px] px-[24px] py-[20px] rounded-[10px] bg-white 
          max-lg:col-span-3
        ">
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
          {reviewNotes.length === 0 ? (
            <div className="flex items-center justify-center flex-1 h-[248px] p-[12px] rounded-[12px] bg-gray-25">
              <span className="text-18m text-gray-400 text-center">오답노트가 없습니다</span>
            </div>
          ) : (
            <div className="flex gap-[12px]">
              {reviewNotes.map((item) => (
              <div key={item.id} className="flex flex-1 flex-col gap-[12px] justify-end h-[248px] p-[10px] border border-gray-75 rounded-[8px]">
                <div className="flex items-center justify-center w-full h-[180px]">
                  <img
                    src={item.image}
                    alt="교재 이미지"
                    className="max-w-full max-h-full w-[100%] h-[100%] object-contain"
                  />
                </div>
                <h3 className="h-[36px] text-13m text-gray-800 line-clamp-2">{item.title}</h3>
              </div>
              ))}
            </div>
          )}
        </div>
        {/* 단어장 */}
        <div className="
          col-span-2 flex flex-col gap-[12px] h-[324px] px-[24px] py-[20px] rounded-[10px] bg-white 
          max-lg:col-span-6 max-lg:h-[152px]
        ">
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
          {vocabs.length === 0 ? (
            <div className="flex items-center justify-center flex-1 h-[248px] p-[12px] rounded-[12px] bg-gray-25">
              <span className="text-18m text-gray-400 text-center">단어장이 없습니다</span>
            </div>
          ) : (
            <div className="
              flex flex-col gap-[8px]
              max-lg:flex-row
            ">
              {vocabs.map((item) => (
                <div key={item.id} className="
                  flex justify-between items-center px-[12px] py-[14px] rounded-[12px] bg-gray-25
                  max-lg:flex-1
                ">
                  <div className="flex flex-col gap-[8px]">
                    <span className="text-13m text-gray-800">{item.title}</span>
                    <div className="">
                      <span className="mr-[8px] text-16b text-gray-800">{item.englishWord}</span>
                      <span className="text-16b text-gray-200">{item.koreanWord}</span>
                    </div>
                  </div>
                  <div className="px-[8px] py-[3px] rounded-[6px] px-[12px] py-[6px] text-12r text-gray-600">단어 <strong className="text-primary-purple">{item.wordCount}</strong>개</div>
                </div>
              ))}
            </div>  
          )}
        </div>
      </div>

      {/* Main */}
      <DndContext
        sensors={useSensors(
          useSensor(MouseSensor, { activationConstraint: { delay: DRAG_ACTIVATION_DELAY_MS, tolerance: 5 } }),
          useSensor(TouchSensor, { activationConstraint: { delay: DRAG_ACTIVATION_DELAY_MS, tolerance: 5 } })
        )}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
      <div className="
        flex flex-col gap-[32px] px-[60px] py-[24px] bg-white
        max-sm:px-[16px]
      ">
        {/* header */}
        <div className="
          flex justify-between items-center pb-[20px] border-b border-gray-90
          max-sm:flex-col max-sm:items-start max-sm:gap-[16px] max-sm:pb-[16px]
        ">
          <div className="
            flex items-center gap-[20px]
            max-sm:flex-1 max-sm:justify-between max-sm:w-full
          ">
            <div className="flex items-center gap-[8px]">
              {folderPath.length > 0 && (
              <BackDroppable onClick={handleClickBackFolder} />
              )}
              <h2 className="text-20b text-black">
                {folderPath.length > 0 ? findFolderName(folderPath) : '내 교재'}
              </h2>
            </div>
            <div className="flex items-center gap-[12px]">
              {/* 
              <button 
                onClick={handleBookRegistration}
                className="flex items-center gap-[6px] h-[40px] px-[14px] rounded-[6px] bg-gray-50"
              >
                <IconPlus width="16" height="16" className="text-gray-300" />
                <span className="text-14m text-gray-500">새 교재</span>
              </button> 
              */}
              <button 
                onClick={handleFolderRegistration}
                className="flex items-center gap-[6px] h-[40px] px-[14px] rounded-[6px] bg-gray-50"
              >
                <IconPlus width="16" height="16" className="text-gray-300" />
                <span className="text-14m text-gray-500">새 폴더</span>
              </button>
            </div>
          </div>
          <div className="
            flex items-center justify-between gap-[20px]
            max-sm:flex-1 max-sm:w-full
          ">
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
            <div className="flex flex-wrap gap-[20px] min-h-[264px]">
              {viewMyDocs && viewMyDocs.length > 0 && viewMyDocs.map((item, idx) => (
                <DraggableDroppableCard
                  key={item.id}
                  id={item.id}
                  item={item}
                  index={idx}
                  onItemClick={() => handleClickItem(item)}
                  className="flex flex-col gap-[12px] w-[160px] h-[264px] border border-gray-75 rounded-[8px] p-[10px] bg-gray-25"
                >
                  <div className="flex items-center justify-center w-full h-[180px]">
                    {item.type === 'folder' ? (
                      getFolderSvg({ width: '120', height: '100', color: item.color })
                    ) : (
                      <img src={item.cover_img || ''} alt="교재 이미지" className="max-w-full max-h-full w-[100%] h-[100%] object-contain" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-13m text-gray-800 line-clamp-2">{item.type === 'folder' ? item.name : item.title}</h3>
                    <button onClick={(event) => handleMoreOptionsClick(event, item)}>
                      <IconKebab width="24" height="24" className="text-gray-200" />
                    </button>
                  </div>
                </DraggableDroppableCard>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-[16px]">
              {viewMyDocs && viewMyDocs.length > 0 && viewMyDocs.map((item, idx) => (
                <DraggableDroppableCard
                  key={item.id}
                  id={item.id}
                  item={item}
                  index={idx}
                  onItemClick={() => handleClickItem(item)}
                  className="flex gap-[12px] h-[100px] border border-gray-75 rounded-[8px] p-[10px] bg-gray-25"
                >
                  <div className="flex items-center justify-center w-[62px] h-[80px]">
                    {item.type === 'folder' ? (
                      getFolderSvg({ width: '42', height: '35', color: item.color })
                    ) : (
                      <img src={item.cover_img || ''} alt="교재 이미지" />
                    )}
                  </div>
                  <div className="flex items-center justify-between flex-1">
                    <h3 className="text-13m text-gray-800 line-clamp-2">{item.type === 'folder' ? item.name : item.title}</h3>
                    <button onClick={(event) => handleMoreOptionsClick(event, item)}>
                      <IconKebab width="24" height="24" className="text-gray-200" />
                    </button>
                  </div>
                </DraggableDroppableCard>
              ))}
            </div>
          )}

          <DragOverlay>
            {activeDragItem ? (
              viewMode === 'category' ? (
                <div className="pointer-events-none flex flex-col gap-[12px] w-[160px] h-[264px] border border-gray-200/60 rounded-[8px] p-[10px] bg-white/70 shadow-xl opacity-70 transform origin-center scale-50">
                  <div className="flex items-center justify-center w-full h-[180px]">
                    {activeDragItem.type === 'folder' ? (
                      getFolderSvg({ width: '120', height: '100', color: activeDragItem.color })
                    ) : (
                      <img src={activeDragItem.cover_img || ''} alt="교재 이미지" className="max-w-full max-h-full w-[100%] h-[100%] object-contain" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-13m text-gray-800 line-clamp-2">{activeDragItem.type === 'folder' ? activeDragItem.name : activeDragItem.title}</h3>
                  </div>
                </div>
              ) : (
                <div className="pointer-events-none flex gap-[12px] h-[100px] border border-gray-200/60 rounded-[8px] p-[10px] bg-white/70 shadow-xl opacity-70 transform origin-center scale-50">
                  <div className="flex items-center justify-center w-[62px] h-[80px]">
                    {activeDragItem.type === 'folder' ? (
                      getFolderSvg({ width: '42', height: '35', color: activeDragItem.color })
                    ) : (
                      <img src={activeDragItem.cover_img || ''} alt="교재 이미지" />
                    )}
                  </div>
                  <div className="flex items-center justify-between flex-1">
                    <h3 className="text-13m text-gray-800 line-clamp-2">{activeDragItem.type === 'folder' ? activeDragItem.name : activeDragItem.title}</h3>
                  </div>
                </div>
              )
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
      
      {/* 오버플로우 메뉴 컴포넌트 */}
      <OverflowMenu />
    </div>
  );
};

export default Home; 
 
// 단순 DnD 래퍼: 각 카드/행에 draggable+droppable 바인딩하고 dnd-kit로 데이터 전달
const DraggableDroppableCard: React.FC<{
  id: string;
  item: any;
  index: number;
  className?: string;
  children: React.ReactNode;
  onItemClick?: () => void;
}> = ({ id, item, index, className, children, onItemClick }) => {
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({ id, data: { item, index } });
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `drop-${id}`, data: { item, index } });

  const mergedRef = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  const pointerDownAtRef = React.useRef<number>(0);
  const activationDelayMs = 1000; // Home의 센서 delay와 동일하게 유지
  const handlePointerDown = () => {
    pointerDownAtRef.current = Date.now();
  };
  
  const handleClick = () => {
    const elapsed = Date.now() - (pointerDownAtRef.current || 0);
    // 롱프레스(드래그) 아닌 빠른 클릭만 허용
    if (elapsed < activationDelayMs) {
      onItemClick && onItemClick();
    }
  };

  return (
    <div
      ref={mergedRef}
      className={`${className || ''} ${isDragging ? 'opacity-50' : ''} ${isOver ? 'ring-2 ring-primary-purple' : ''}`}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};

// 뒤로가기 버튼 droppable
const BackDroppable: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'back-area', data: { kind: 'back' } });
  return (
    <button ref={setNodeRef} onClick={onClick} className={`${isOver ? 'ring-2 ring-primary-purple rounded-[6px]' : ''}`}>
      <IconArrowLeft7 width="32" height="32" className="text-black" />
    </button>
  );
};