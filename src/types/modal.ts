export interface ModalOptions {
  preserveState?: boolean;    // 컴포넌트 상태 보존 (기본값: true)
  preserveScroll?: boolean;   // 스크롤 위치 보존 (기본값: true)
  keepInDOM?: boolean;       // DOM에 유지할지 여부 (기본값: true)
}

export interface ModalStack {
  id: string;
  component: React.ComponentType<Record<string, unknown>>;
  props: Record<string, unknown>;
  options: ModalOptions;
  isActive: boolean;
}

export interface ModalContextType {
  stack: ModalStack[];
  activeIndex: number;
  openModal: (component: React.ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: ModalOptions) => void;
  closeModal: () => void;
  pushModal: (component: React.ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: ModalOptions) => void;
  popModal: () => void;
  goToModal: (index: number) => void;
  clearStack: () => void;
} 