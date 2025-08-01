# EveryStudy Frontend

학습 관리 플랫폼 EveryStudy의 프론트엔드 프로젝트입니다.

## 🚀 기술 스택

- **React 18** - 사용자 인터페이스 라이브러리
- **TypeScript** - 정적 타입 검사
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **React Router** - 클라이언트 사이드 라우팅
- **Framer Motion** - 애니메이션 라이브러리
- **Phosphor Icons** - 아이콘 라이브러리

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Button.tsx      # 공통 버튼 컴포넌트
│   └── Navigation.tsx  # 네비게이션 컴포넌트
├── layouts/            # 레이아웃 컴포넌트
│   └── MainLayout.tsx  # 메인 레이아웃
├── pages/              # 페이지 컴포넌트
│   ├── Workbook.tsx    # 교재 목록 페이지
│   ├── WrongNote.tsx   # 오답 노트 페이지
│   ├── Exam.tsx        # 모의고사 페이지
│   ├── Login.tsx       # 로그인 페이지
│   └── Register.tsx    # 회원가입 페이지
├── routes/             # 라우터 설정
│   └── AppRoutes.tsx   # 애플리케이션 라우트
├── assets/             # 정적 리소스
├── styles/             # 스타일 파일
├── utils/              # 유틸리티 함수
├── hooks/              # 커스텀 훅
└── types/              # TypeScript 타입 정의
```

## 🎯 주요 기능

### 📚 학습 관리
- **교재 목록**: 다양한 과목별 교재 관리
- **진도율 추적**: 학습 진행 상황 모니터링
- **학습 통계**: 개인별 학습 데이터 분석

### 📝 오답 노트
- **틀린 문제 관리**: 과목별, 난이도별 분류
- **필터링**: 과목, 난이도, 날짜별 필터
- **재학습**: 틀린 문제 다시 풀기 기능

### 📊 모의고사
- **시험 목록**: 다양한 모의고사 제공
- **성적 분석**: 과목별 점수 및 총점 표시
- **진행 상황**: 완료/진행중/미시작 상태 관리

### 👤 사용자 관리
- **회원가입**: 학년, 학교 정보 포함
- **로그인**: 이메일/비밀번호 인증
- **마이페이지**: 개인 정보 및 통계 관리

## 🛠️ 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 대응
- **다크 모드 지원**: 사용자 선호도에 따른 테마 변경
- **접근성**: WCAG 가이드라인 준수
- **성능 최적화**: 코드 스플리팅 및 지연 로딩

## 📱 페이지별 기능

### 교재 (`/workbook`)
- 과목별 교재 카드 형태 표시
- 진도율 시각화
- 학습 시작/계속 기능

### 오답 노트 (`/wrongnote`)
- 필터링 기능 (과목, 난이도)
- 문제/답안/해설 표시
- 재학습 및 해설 보기

### 모의고사 (`/exam`)
- 시험별 상태 관리
- 과목별 점수 표시
- 진행률 시각화

### 로그인 (`/login`)
- 이메일/비밀번호 인증
- 소셜 로그인 (Google, Twitter)
- 비밀번호 찾기

### 회원가입 (`/register`)
- 필수 정보 입력
- 학년 및 학교 정보
- 이용약관 동의

## 🔧 개발 가이드

### 컴포넌트 작성 규칙
- TypeScript 인터페이스 정의
- 재사용 가능한 구조 설계
- Tailwind CSS 클래스 활용

### 라우팅 구조
- 레이아웃 기반 라우팅
- 인증 필요/불필요 페이지 분리
- 중첩 라우트 지원

### 상태 관리
- React Hooks 활용
- 로컬 상태 관리
- (향후 Redux/Zustand 도입 예정)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
