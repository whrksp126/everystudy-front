// 공통 폴더 아이템 타입
export interface FolderItem {
  item_type: 'FOLDER';
  folder_id: string;
  title: string;
  folder_color: string;
  folder_opacity: number;
  updated_at: string;
  created_at: string;
  folder_items: DataItem[];
}

// 교재 아이템 타입
export interface BookItem {
  item_type: 'BOOK';
  book_id: string;
  title: string;
  img_url: string;
  subject?: string;
  grade?: string;
  updated_at: string;
  created_at: string;
}

// 시험 아이템 타입
export interface ExamItem {
  item_type: 'EXAM';
  exam_id: string;
  title: string;
  exam_type: 'MOCK' | 'PRACTICE' | 'QUIZ';
  subject?: string;
  grade?: string;
  duration?: number;
  total_score?: number;
  my_score?: number;
  is_completed?: boolean;
  updated_at: string;
  created_at: string;
}

// 복습 아이템 타입
export interface ReviewItem {
  item_type: 'REVIEW';
  review_id: string;
  book_id: string;
  title: string;
  chapter?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  progress?: number;
  total_questions?: number;
  completed_questions?: number;
  updated_at: string;
  created_at: string;
}

// 과목 타입
export interface Subject {
  id: string;
  name: string;
  priority?: number;
}

// DIY 시험지 타입
export interface CustomExam {
  book_list: {workbook_id: number, workbook_name: string, type: number, is_license: boolean}[];
  created_at: string;
  description: string;
  id: string;
  img_url: string;
  last_used_at: string;
  name: string;
  question_count: number;
  repeat: number;
}

// 통합 데이터 아이템 타입
export type DataItem = BookItem | ExamItem | ReviewItem | FolderItem;

// 데이터 타입 구분
export type DataType = 'BOOK' | 'EXAM' | 'REVIEW';

// Home 페이지용 데이터 타입들
export interface HomeBookItem {
  id: string;
  title: string;
  image: string | null;
  isFolder: boolean;
  folderIcon?: any;
}

export interface RecentStudyBook {
  id: string;
  title: string;
  image: string;
}

export interface ReviewItemHome {
  id: string;
  title: string;
  image: string;
}

export interface VocabularyItem {
  id: string;
  title: string;
  englishWord: string;
  koreanWord: string;
  wordCount: number;
}

// 컨텍스트 타입
export interface DataContextType {
  // 데이터 상태
  bookItems: HomeBookItem[];
  examItems: DataItem[];
  reviewItems: DataItem[];
  subjects: Subject[];
  subjectLoded: boolean;
  
  // 설정 함수들
  setBookItems: (items: HomeBookItem[]) => void;
  setExamItems: (items: DataItem[]) => void;
  setReviewItems: (items: DataItem[]) => void;
  setSubjects: (subjects: Subject[]) => void;
  
  // CRUD 함수들
  addItem: (type: DataType, item: DataItem) => void;
  updateItem: (type: DataType, itemId: string, updatedItem: Partial<DataItem>) => void;
  deleteItem: (type: DataType, itemId: string) => void;
  
  // 조회 함수들
  getItems: (type: DataType) => DataItem[];
  getBooks: () => HomeBookItem[];
  getExams: () => ExamItem[];
  getReviews: () => ReviewItem[];
  getFolders: (type: DataType) => FolderItem[];
  
  // 과목 관련 함수들
  getSubjects: () => Subject[];
  getSubjectById: (subjectId: string) => Subject | undefined;
  fetchSubjects: () => Promise<void>;
  
  // Home 페이지용 함수들
  getRecentStudyBooks: () => RecentStudyBook[];
  getReviewItems: () => ReviewItemHome[];
  getVocabularyItems: () => VocabularyItem[];
} 