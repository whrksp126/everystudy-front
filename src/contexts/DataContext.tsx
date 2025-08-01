import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { 
  DataContextType, 
  DataItem
} from '../types/data';
import { IconFolder7568F1 } from '../assets/Icon.jsx';
import { SERVER_URL } from '../utils/server.js';
import { fetchDataAsync } from '../utils/common.js';

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {

  const [userInfo, setUserInfo] = useState<any>(null);
  const [userInfoLoaded, setUserInfoLoaded] = useState<boolean>(false);
  const [myDocs, setMyDocs] = useState<any>(null);
  const [myDocsLoaded, setMyDocsLoaded] = useState<boolean>(false);
  const [vocabs, setVocabs] = useState<any>(null);
  const [vocabsLoaded, setVocabsLoaded] = useState<boolean>(false);
  const [ebooks, setEbooks] = useState<any>(null);
  const [ebooksLoaded, setEbooksLoaded] = useState<boolean>(false);
  const [reviewNotes, setReviewNotes] = useState<any>(null);
  const [reviewNotesLoaded, setReviewNotesLoaded] = useState<boolean>(false);
  const [diyExams, setDiyExams] = useState<any>(null);
  const [diyExamsLoaded, setDiyExamsLoaded] = useState<boolean>(false);

  useEffect(() => {
    initFetchData();
  }, []);
  
  const initFetchData = async () => {
    await getFetchUserInfo();
    await getFetchMyDocs();
    await getFetchVocabs();
    await getFetchEbooks();
    await getFetchReviewNotes();
    await getFetchDiyExams();
  };

  // 유저 정보 조회
  const getFetchUserInfo = async () => {
    // const url = `${SERVER_URL}/user/info`;
    // const method = 'GET';
    // const data = {};
    // const userInfo = await fetchDataAsync(url, method, data);
    // if(userInfo){
    //   setUserInfo(userInfo);
    //   setUserInfoLoaded(true);
    // }
  };

  // 내 문서 조회
  const getFetchMyDocs = async () => {
    
    // const url = `${SERVER_URL}/user/my-docs`;
    // const method = 'GET';
    // const data = {};
    // const myDocs = await fetchDataAsync(url, method, data);
    // if(myDocs){
    //   setMyDocs(myDocs);
    // }

    // 교재 데이터
    setMyDocs(
      [
        {
          id: '1',
          title: '고2 중간고사 모음',
          image: null as string | null,
          isFolder: true,
          folderIcon: IconFolder7568F1,
          updatedAt: new Date(2024, 11, 15, 14, 30, 0), // 2024년 12월 15일 14시 30분 0초
          createdAt: new Date(2024, 11, 15, 14, 30, 0), // 2024년 12월 15일 14시 30분 0초
        },  
        {
          id: '2',
          title: '2026 마더텅 수능기출문제집 수학 2 (2025년)',
          image: 'https://image.yes24.com/goods/140199667/XL',
          isFolder: false,
          updatedAt: new Date(2024, 11, 10, 9, 15, 0), // 2024년 12월 10일 9시 15분 0초
          createdAt: new Date(2024, 11, 10, 9, 15, 0), // 2024년 12월 10일 9시 15분 0초
        },
        {
          id: '3',
          title: 'Xistory 자이스토리 공통수학2 (2025년)',
          image: 'https://image.yes24.com/goods/137485546/XL',
          isFolder: false,
          updatedAt: new Date(2024, 11, 5, 16, 45, 30), // 2024년 12월 5일 16시 45분 30초
          createdAt: new Date(2024, 11, 5, 16, 45, 30), // 2024년 12월 5일 16시 45분 30초
        },
      ]
    )
    setMyDocsLoaded(true);
  };

  // 단어장 조회
  const getFetchVocabs = async () => {
    // const url = `${SERVER_URL}/user/vocabs`;
    // const method = 'GET';
    // const data = {};
    // const vocabs = await fetchDataAsync(url, method, data);
    // if(vocabs){
    //   setVocabs(vocabs);
    // }


    // 단어장 데이터
    setVocabs([
      {
        id: '1',
        title: '기본 영어 단어',
        englishWord: 'Available',
        koreanWord: '가능한',
        wordCount: 12,
      },
      {
        id: '2',
        title: '기본 영어 단어',
        englishWord: 'Available',
        koreanWord: '가능한',
        wordCount: 12,
      },
      {
        id: '3',
        title: '기본 영어 단어',
        englishWord: 'Available',
        koreanWord: '가능한',
        wordCount: 12,
      },
    ]);
    setVocabsLoaded(true);
  };

  // E-BOOK 조회
  const getFetchEbooks = async () => {
    // const url = `${SERVER_URL}/user/ebooks`;
    // const method = 'GET';
    // const data = {};
    // const ebooks = await fetchDataAsync(url, method, data);
    // if(ebooks){
    //   setEbooks(ebooks);
    //   setEbooksLoaded(true);
    // }

    setEbooks(
      [
        {
          id: 'ebook-section-1',
          title: '다운로드 수가 많아요',
          books: [
            {
              id: '1',
              title: '2026 마더텅 수능기출문제집 수학 2 (2025년)',
              tags: [{name: '고3', color: 'purple'},{name: '연계', color: 'blue'},],
              area: '수학',
              publisher: '한국교육방송공사',
              releaseDate: new Date(2024, 11, 1),
              image: 'https://image.yes24.com/goods/140199667/XL',
              files : {
                pdf : [{title: '문제집 파일'},{title: '해설 파일'}],
                audio : [{title: '음성 파일'}],
              }
            },
            {
              id: '2',
              title: 'Xistory 자이스토리 공통수학2 (2025년)',
              tags: [{name: '고3',color: 'purple',},{name: '연계',color: 'blue',},],
              area: '수학',
              publisher: '한국교육방송공사',
              releaseDate: new Date(2024, 11, 1),
              image: 'https://image.yes24.com/goods/137485546/XL',
              files : {
                pdf : [{title: '문제집 파일'},{title: '해설 파일'}],
                audio : [{title: '음성 파일'}],
              }
            },
            {
              id: '3',
              title: 'EBS 수능완성 수학영역 (2025년)',
              tags: [{name: '고3',color: 'purple',},{name: '연계',color: 'blue',},],
              area: '수학',
              publisher: '한국교육방송공사',
              releaseDate: new Date(2024, 11, 1),
              image: 'https://image.yes24.com/goods/138000000/XL',
              files : {
                pdf : [{title: '문제집 파일'},{title: '해설 파일'}],
                audio : [{title: '음성 파일'}],
              }
            },
          ],
        },
        {
          id: 'ebook-section-2',
          title: '새로 들어왔어요',
          books: [
            {
              id: '4',
              title: '2025 수능특강 영어 (2025년)',
              tags: [{name: '고3',color: 'purple',},{name: '연계',color: 'blue',},],
              area: '영어',
              publisher: '한국교육방송공사',
              image: 'https://image.yes24.com/goods/139000000/XL',
              releaseDate: new Date(2024, 11, 1),
              files : {
                pdf : [{title: '문제집 파일'},{title: '해설 파일'}],
                audio : [{title: '음성 파일'}],
              }
            },
            {
              id: '5',
              title: '고등 수학의 정석 (2025년)',
              tags: [{name: '고3',color: 'purple',},{name: '연계',color: 'blue',},],
              area: '수학',
              publisher: '한국교육방송공사',
              image: 'https://image.yes24.com/goods/140000000/XL',
              releaseDate: new Date(2024, 11, 5),
              files : {
                pdf : [{title: '문제집 파일'},{title: '해설 파일'}],
                audio : [{title: '음성 파일'}],
              }
            },
            {
              id: '6',
              title: '물리학 개념서 (2025년)',
              tags: [{name: '고3',color: 'purple',},{name: '연계',color: 'blue',},],
              area: '물리',
              publisher: '한국교육방송공사',
              image: 'https://image.yes24.com/goods/141000000/XL',
              releaseDate: new Date(2024, 11, 10),
              files : {
                pdf : [{title: '문제집 파일'},{title: '해설 파일'}],
                audio : [{title: '음성 파일'}],
              }
            },
          ],
        },
      ]
    );
  };

  // 복습 노트 조회
  const getFetchReviewNotes = async () => {
    // const url = `${SERVER_URL}/user/review-notes`;
    // const method = 'GET';
    // const data = {};
    // const reviewNotes = await fetchDataAsync(url, method, data);
    // if(reviewNotes){
    //   setReviewNotes(reviewNotes);
    // }

    // 복습 데이터
    setReviewNotes([
      {
        id: '1',
        title: '2024 수특 문학 틀린 문제 01-9',
        image: 'https://everystudy-assets.s3.ap-northeast-2.amazonaws.com/problem_content/416/d0bb0f25-37e5-4fb7-920d-4c9f65aaf7b0/9/c76acefd-3fa0-4cc4-9ec1-51b9d0cdb1a5.jpg',
      },
      {
        id: '2',
        title: '고1 6월 모의고사  틀린 문제 18-2',
        image: 'https://everystudy-assets.s3.ap-northeast-2.amazonaws.com/problem_content/401/745649f3-e7b0-41ad-acad-da2edf6cea46/2/b1588ad3-9e29-4639-a334-d9d624fb51ec.jpg',
      },
    ]);
    setReviewNotesLoaded(true);

  };

  // DIY 시험지 조회
  const getFetchDiyExams = async () => {
    // const url = `${SERVER_URL}/user/diy-exams`;
    // const method = 'GET';
    // const data = {};
    // const diyExams = await fetchDataAsync(url, method, data);
    // if(diyExams){
    //   setDiyExams(diyExams);
    //   setDiyExamsLoaded(true);
    // }
  };



  const getUserInfo = () => {
    return userInfo;
  };

  const getMyDocs = () => {
    return myDocs;
  };

  const getReviewNotes = () => {
    return reviewNotes;
  };

  const getDiyExams = () => {
    return diyExams;
  };

  const getEbooks = () => {
    return ebooks;
  };

  const getVocabs = () => {
    return vocabs;
  };


  // // 최근 공부한 교재 데이터
  // const [recentStudyBooks] = useState([
  //   {
  //     id: '1',
  //     title: 'Xistory 자이스토리 공통수학2 (2025년)',
  //     image: 'https://image.yes24.com/goods/137485546/XL',
  //   },
  //   {
  //     id: '2',
  //     title: '2026 마더텅 수능기출문제집 수학 2 (2025년)',
  //     image: 'https://image.yes24.com/goods/140199667/XL',
  //   },
  // ]);


  const value: DataContextType = {
    userInfo,
    myDocs,
    reviewNotes,
    diyExams,
    vocabs,
    ebooks,

    getUserInfo,
    getMyDocs,
    getReviewNotes,
    getDiyExams,
    getVocabs,
    getEbooks,

    userInfoLoaded,
    myDocsLoaded,
    reviewNotesLoaded,
    diyExamsLoaded,
    vocabsLoaded,
    ebooksLoaded,

  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
