export interface AlertOptions {
  preserveState?: boolean;    // 컴포넌트 상태 보존 (기본값: true)
  preserveScroll?: boolean;   // 스크롤 위치 보존 (기본값: true)
  keepInDOM?: boolean;       // DOM에 유지할지 여부 (기본값: true)
}

export interface AlertStack {
  id: string;
  component: React.ComponentType<Record<string, unknown>>;
  props: Record<string, unknown>;
  options: AlertOptions;
  isActive: boolean;
}

export interface AlertContextType {
  stack: AlertStack[];
  activeIndex: number;
  openAlert: (component: React.ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: AlertOptions) => void;
  closeAlert: () => void;
  pushAlert: (component: React.ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: AlertOptions) => void;
  popAlert: () => void;
  goToAlert: (index: number) => void;
  clearStack: () => void;
} 