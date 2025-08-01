// 공통 속성
interface BaseItem {
  item_type: 'BOOK' | 'FOLDER';
  title: string;
  updated_at: string;
  created_at: string;
}

// 책 아이템 타입
export interface BookItem extends BaseItem {
  item_type: 'BOOK';
  book_id: string;
  img_url: string;
}

// 폴더 아이템 타입
export interface FolderItem extends BaseItem {
  item_type: 'FOLDER';
  folder_id: string;
  folder_color: string;
  folder_opacity: number;
  folder_items: (BookItem | FolderItem)[];
}

// 유니온 타입
export type WorkbookItem = BookItem | FolderItem  ; 