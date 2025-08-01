// 공통 속성
interface BaseItem {
  item_type: 'BOOK' | 'REVIEW' | 'EXAM' | 'FOLDER';
  title: string;
  updated_at: string;
  created_at: string;
}

// 교재 아이템 타입
export interface BookItem extends BaseItem {
  item_type: 'BOOK';
  book_id: string;
  img_url: string;
  subject?: string; // 과목 (수학, 영어, 국어 등)
  grade?: string; // 학년 (고1, 고2, 고3 등)
}

// 복습 문제 아이템 타입
export interface ReviewItem extends BaseItem {
  item_type: 'REVIEW';
  review_id: string;
  book_id: string; // 어떤 교재의 복습인지
  chapter?: string; // 챕터
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  progress?: number; // 진행률 (0-100)
  total_questions?: number;
  completed_questions?: number;
}

// 시험지 아이템 타입
export interface ExamItem extends BaseItem {
  item_type: 'EXAM';
  exam_id: string;
  exam_type: 'MOCK' | 'PRACTICE' | 'QUIZ'; // 모의고사, 연습시험, 퀴즈
  subject?: string;
  grade?: string;
  duration?: number; // 시험 시간 (분)
  total_score?: number;
  my_score?: number;
  is_completed?: boolean;
}

// 폴더 아이템 타입
export interface FolderItem extends BaseItem {
  item_type: 'FOLDER';
  folder_id: string;
  folder_color: string;
  folder_opacity: number;
  folder_items: StudyItem[];
}

// 유니온 타입 - 모든 학습 아이템
export type StudyItem = BookItem | ReviewItem | ExamItem | FolderItem; 