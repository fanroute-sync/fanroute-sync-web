# FanRoute Sync Rev.3 프론트엔드 구현 명세서 for Codex

## 0. 문서 목적

이 문서는 `fanroute-sync-web` 저장소에서 FanRoute Sync의 Rev.3 와이어프레임을 실제 프론트엔드 화면과 사용자 플로우로 구현하기 위한 Codex 작업 지시서다.

구현 기준:
- `기획안.md`
- `2026-07-08-busan-concert-trip-mvp-design.md`
- `api-spec.md`
- 기획 회의 1~4차
- Rev.3 와이어프레임
- 현재 저장소에 이미 존재하는 코드와 구조

중요:
- 와이어프레임은 저해상도 구조 설계이므로 시각 디자인을 과하게 확장하지 않는다.
- 화면 구조, 이동 흐름, 상태, 기능 우선순위를 와이어프레임 기준으로 구현한다.
- 기존 프로젝트 구조와 API 명세가 와이어프레임보다 더 구체적이면 기존 명세를 우선한다.
- 임의로 새로운 백엔드 API 규격을 만들지 않는다.

---

## 1. 서비스 개요

서비스명: FanRoute Sync

서비스 목적:
K-POP 공연을 위해 부산을 방문하는 사용자가 공연 일정 중심으로 여행 루트를 만들고, 공연 전후 관광 일정을 관리하며, 다른 팬의 여행 루트를 참고하거나 정보를 공유하고 동행을 모집할 수 있는 부산 콘서트 여행 서비스.

핵심 기능:
1. 소셜 로그인 및 프로필 설정
2. 부산 여행 일정 생성
3. 공연 선택
4. 공연일 기반 AI 일정 생성
5. 날짜별 여행 일정 편집
6. 숙박 정보 설정
7. 여행 스타일 설정
8. Fan Route 커뮤니티
9. 루트 공유 및 참고
10. 마이페이지 / 활동 / AI 사용 현황

---

## 2. 사용 기술

기존 저장소 설정을 유지한다.

- Next.js App Router
- TypeScript
- Tailwind CSS
- pnpm
- TanStack Query
- Axios
- React Hook Form
- Zod
- Zustand
- Vitest
- React Testing Library
- Playwright

규칙:
- 서버 상태: TanStack Query
- 클라이언트 전역 상태: Zustand
- 폼 상태: React Hook Form
- Validation: Zod
- API 호출: 기존 Axios 공통 Client
- `any` 사용 최소화
- 기존 공통 컴포넌트가 있으면 재사용
- 불필요한 신규 패키지 설치 금지

---

## 3. 구현 전 저장소 분석

코드 작성 전에 반드시 현재 저장소를 먼저 분석한다.

확인할 것:
1. `src/app` 또는 `app` 라우팅 구조
2. 기존 Layout
3. 기존 인증 처리 방식
4. Axios API Client
5. TanStack Query Provider
6. Zustand Store
7. 공통 UI Component
8. Tailwind 설정
9. 환경변수 구조
10. 기존 구현 페이지
11. API 타입 정의
12. 테스트 구성
13. 모바일 Navigation 구현 여부

작업 시작 전 아래 내용을 먼저 보고한다.

```text
- 현재 프로젝트 구조
- 이미 구현된 화면
- 재사용 가능한 컴포넌트
- 재사용 가능한 hook / API
- 추가할 파일
- 수정할 파일
- 삭제 또는 교체가 필요한 파일
```

바로 코드를 수정하지 말고 이 분석을 먼저 수행한다.

---

## 4. 전체 사용자 플로우

```text
앱 최초 실행
→ 언어 설정
→ 소셜 로그인
→ 프로필 초기 설정
→ 홈
→ 여행 일정 생성
→ 공연일 추천 여부
→ AI 일정 생성 또는 직접 구성
→ 여행 일정 상세
→ 날짜별 일정 편집
→ Fan Route 공유
```

로그인 전에는 하단 탭 서비스에 접근할 수 없다.

로그인 후 하단 탭은 4개다.

```text
메인
일정
커뮤니티
마이페이지
```

---

## 5. Rev.3 핵심 정책

### 5.1 숙박 정보와 여행 스타일

숙박 정보와 여행 스타일은 **초기 여행 일정 생성 Step에 포함하지 않는다.**

잘못된 Flow:

```text
일정 입력
→ 숙박 정보
→ 여행 스타일
→ AI 생성
```

구현 금지.

올바른 Flow:

```text
일정 입력
→ 공연일 추천 여부
→ AI 생성 또는 직접 구성
→ 여행 일정 상세
    ├─ 숙박 정보
    └─ 여행 스타일
```

숙박 정보 / 여행 스타일은 일정이 만들어진 후 선택적으로 설정한다.
강제 입력이 아니다.

### 5.2 AI 일정 생성 단위

AI 일정 생성은 전체 여행 기간을 한 번에 생성하는 기능으로 구현하지 않는다.

**날짜 1건 단위 생성**이다.

예:

```text
7월 29일 일정 생성
→ 성공
→ 7월 29일 날짜별 일정 편집

7월 30일 일정 생성
→ 별도 실행
```

완료 화면도 다음처럼 표시한다.

```text
7월 29일 (1일차)
일정이 생성되었습니다!
```

### 5.3 공연일 추천 "아니오"

공연일 추천 여부에서 "아니오" 선택 시 AI 일정 생성 화면을 전부 건너뛴다.

```text
공연일 추천 여부
→ 아니오
→ 날짜별 일정 편집 빈 상태
```

공연 일정만 고정된 상태로 존재하며 일반 장소는 비어 있다.
AI 사용 횟수도 차감하지 않는다.

---

## 6. 권장 라우팅 구조

현재 저장소와 충돌하지 않는다면 아래 구조를 참고한다.

```text
/login
/onboarding/language
/onboarding/profile

/
/trips
/trips/new
/trips/[tripId]
/trips/[tripId]/days/[date]
/trips/[tripId]/accommodation
/trips/[tripId]/style
/trips/[tripId]/ai-generating
/trips/[tripId]/ai-result
/trips/[tripId]/places/add

/community
/community/write
/community/[postId]

/my
/my/profile
/my/activity
/my/activity/[type]
/my/ai-usage
/my/language
/my/terms
```

실제 경로는 기존 프로젝트의 naming convention을 우선한다.

---

## 7. Onboarding

### 7.1 언어 설정

```text
언어를 선택해주세요

● 한국어
○ English
○ 中文
○ 日本語

[다음]
```

정책:
- UI에는 4개 언어 노출 가능
- MVP에서 실제 선택 가능한 언어는 한국어만
- 나머지는 disabled 또는 Phase 2 표시

### 7.2 소셜 로그인

```text
Google로 계속하기
Apple로 계속하기
Meta로 계속하기
```

MVP:
- Google OAuth만 활성
- Apple / Meta disabled
- provider 확장을 고려한 구조 사용

### 7.3 프로필 초기 설정

항목:
- 프로필 사진
- 닉네임

닉네임 정책:
- 필수
- 중복 불가
- 디바운스 기반 중복 체크
- 최종 서버 unique 검증
- 사용 가능 / 중복 상태 표시

---

## 8. Home

### 8.1 일정 등록 전

```text
Header
부산 콘서트 여행
알림

아직 등록된 일정이 없어요
[+ 여행 일정 만들기]

지금 부산 콘서트 정보
매거진 · 요즘 핫한 곳
공지사항

Bottom Navigation
```

일정 미등록 시 일정 카드는 노출하지 않는다.
공통 콘텐츠는 항상 노출한다.

### 8.2 일정 등록 후

```text
D-3
공연까지 남은 시간

OO 콘서트 · 6/21
오늘 일정 보기 →

과거에 만든 루트
추천 루트 바로가기
지금 부산 콘서트 정보
```

핵심:
- 공연 D-Day
- 오늘 일정
- 과거 일정
- 추천 루트
- 부산 콘서트 정보

---

## 9. Schedule Create

초기 일정 생성은 2단계만 사용한다.

```text
Step 1: 일정 입력 + 공연 선택
Step 2: 공연일 추천 여부
```

숙박 정보 / 여행 스타일은 이 Flow에 포함하지 않는다.

### 9.1 Step 1 — 기본 여행 일정

입력:
- 부산 도착 날짜
- 부산 도착 시간대: 아침 / 점심 / 저녁
- 부산 출발 날짜
- 부산 출발 시간대: 아침 / 점심 / 저녁
- 관람할 공연 검색 및 선택

Validation:
- 출발일 >= 도착일
- 같은 날짜면 출발 시간이 도착 이후
- 공연은 여행 기간 내에 존재해야 함
- 필수값 확인

공연 정보는 MVP 자체 Seed Data 또는 실제 API 명세를 사용한다.
실시간 공연 API를 새로 가정하지 않는다.

---

## 10. 공연일 추천 여부

```text
공연일 추천 일정을 제공해드릴까요?

[예]
[아니오]
```

### 예
- AI 일정 생성 상태로 이동
- 공연장 기준 템플릿 / AI 로직 사용
- 공연일이 여러 날이면 서로 다른 템플릿이 겹치지 않도록 배정

### 아니오
바로 날짜별 일정 편집으로 이동한다.

초기 상태:

```text
공연일 · 고정
09:00 OO 공연장

아직 추가된 장소가 없어요
공연 일정 외에는 직접 채워보세요

[+ 장소 / 일정 추가하기]
```

AI 사용 횟수 차감 없음.

---

## 11. AI Schedule Generation

### 11.1 생성 중

```text
AI가 여행 일정을 생성하고 있어요

공연장 위치를 기준으로
최적의 동선을 계산하는 중입니다

보통 10~20초 정도 걸려요
```

필요 요소:
- Spinner 또는 Progress UI
- 생성 상태 표시
- Polling 또는 상태 조회 방식은 API 명세 기준
- 화면 이탈 후에도 서버 작업 지속 가능 구조 고려

### 11.2 생성 실패

```text
일정 생성에 실패했어요

일시적인 오류가 발생했습니다.
다시 시도해보시겠어요?

[재시도하기]
[입력값 다시 수정하기]
```

재시도:
- 동일 입력값으로 다시 요청

입력값 수정:
- Step 1 복귀

실패 시 AI 사용 횟수 차감 없음.

### 11.3 생성 완료

```text
✅

7월 29일 (1일차)
일정이 생성되었습니다!

공연장 위치를 기준으로
동선을 최적화했어요

[확인]
```

확인 → 해당 날짜의 날짜별 일정 편집 화면으로 이동.

---

## 12. 여행 일정 상세

```text
← 내 부산 여행 상세

[공유]

[숙박 정보]
[여행 스타일]
[메모장]

전체 기간
6/20 — 6/24 (5일)

공연
OO 콘서트 · 6/21

숙소

일차별 요약
D1 >
D2 ★ >
D3 >

[Fan Route에 공유하기]
[일정 편집하기]
```

정책:
- 일차 카드 선택 → 날짜별 일정 편집
- 공연일 ★ 표시
- 숙박 정보 → 숙박 설정
- 여행 스타일 → 여행 스타일 설정
- Fan Route 공유 진입점 제공

---

## 13. 숙박 정보 설정

진입 경로:
- 여행 일정 상세 → 숙박 정보
- 날짜별 일정 편집 상단 → 숙박 정보

초기 일정 생성에서는 진입하지 않는다.

```text
← 숙박 정보

[+ 추가]

체크인
~
체크아웃

* 숙소는 날짜별 출발/도착 기점이 자동으로 설정돼요

[저장]
```

정책:
- 복수 숙소 등록 가능
- 체크인 / 체크아웃 관리
- 날짜별 출발/도착 기준점으로 활용

---

## 14. 여행 스타일 설정

```text
← 여행 스타일

여행 강도
[널럴하게]
[타이트하게]

여행 인원 구성
[친구]
[연인]
[혼자]
[부모님]
[아이]

나의 여행 MBTI
[맛집탐방형]
[감성사진형]
[역사문화형]
...

[저장]
```

정책:
- 여행 인원 구성 복수 선택
- 여행 MBTI 9종 카드형 선택
- 초기 일정 생성 필수값 아님

---

## 15. 날짜별 일정 편집

```text
← 내 부산 여행

[숙박 정보]
[여행 스타일]
[메모장]

6/20
6/21 ★
6/22
6/23
6/24

[AI 일정]
[편집]

Kakao Map

08:00 숙소 출발

공연일 · 고정
09:00 OO 공연장
[상세보기]

13:00 광안리 맛집
[변경] [삭제]

14:30 해운대 해수욕장
[변경] [삭제]

[+ 장소 / 일정 추가하기]
```

### 15.1 Kakao Map
- 카카오맵 SDK 사용
- 일정 장소와 Marker 연결
- 지도와 Timeline은 동일한 데이터 사용

### 15.2 공연 카드
공연 일정은 고정.

금지:
- 삭제
- 변경
- Drag & Drop

가능:
- 상세보기

### 15.3 일반 장소
가능:
- 변경
- 삭제
- 상세보기
- 새 장소 추가

변경 사항은 자동 저장한다.
Optimistic Update 사용 시 실패 rollback 구현.

### 15.4 AI 일정 사용 횟수

```text
AI 일정
잔여 1 / 5회
```

규칙:
- 서버 값만 신뢰
- 클라이언트 임의 증가/감소 금지
- 생성 성공 시에만 사용 처리
- 실패 시 차감 없음

---

## 16. 장소 / 일정 추가

```text
[장소 검색]

[인기순]
[거리순]

[관광지]
[음식점]
[카페]

검색 결과

커뮤니티 일정 링크로 추가
[복사한 링크 붙여넣기]
```

데이터:
- TourAPI
- 현재 프로젝트의 음식점 API
- 실제 API 명세에 존재하는 연동 소스

거리순 기준:
- 이전 일정이 있으면 이전 장소 기준
- 이전 일정이 없으면 부산역 기준

커뮤니티 참고 루트는 MVP에서 텍스트 링크 기반 복사/붙여넣기.

---

## 17. Fan Route Sync

게시판 타입:

```ts
type CommunityPostType = "INFO" | "REFERENCE_ROUTE" | "COMPANION";
```

UI 명칭:
- 정보 공유
- 참고 루트
- 동행 모집

---

## 18. 커뮤니티 목록

```text
Fan Route Sync

[공연명 / 장소 / 해시태그 검색]

[전체]
[정보 공유]
[참고 루트]
[동행 모집]

[부산 전체 ▾]
                  [최신순 ▾]

게시글 목록
```

검색:
- 공연명
- 장소
- 해시태그

지역 필터:
- 부산 전체
- 세부 지역

정렬:
- 최신순 기본
- 인기순

---

## 19. 정보 공유 게시글

기본 데이터:
- 제목
- 본문
- 작성자
- 작성일
- 해시태그
- 좋아요
- 댓글

---

## 20. 참고 루트 게시글

작성 Flow:

```text
내 저장 일정 선택
→ 제목
→ 태그
→ 게시
```

상세에서 표시:
- 루트 정보
- 장소 순서
- 여행 날짜
- 공연 정보

CTA:

```text
복사하기
```

MVP 복사 방식은 텍스트 링크 기반.

---

## 21. 동행 모집 게시글

작성 항목:
- 공연
- 날짜
- 모집 인원
- 제목
- 본문

목록 표시:

```text
모집중 1/3
```

MVP:

```text
댓글로 신청
→ 작성자와 댓글로 연락
```

채택 기능은 Phase 2.

제한:
- 방장 활성 모집글 1개
- 참여 최대 5개

서버 응답을 기준으로 검증한다.

---

## 22. 글쓰기

게시글 타입별 Form을 분리한다.

예:

```text
features/community/components/forms/
  InfoPostForm.tsx
  RoutePostForm.tsx
  CompanionPostForm.tsx
```

한 개의 거대한 Form에서 모든 게시글 타입을 처리하지 않는다.

---

## 23. 게시글 상세

```text
← 게시글

작성자
3분 전

OO 콘서트 원정 루트

#맛집위주
#혼자여행

♥ 24
댓글 4

[복사하기]

댓글 내용
♥ 좋아요 3 · 답글 달기

    답글
    ♥ 좋아요 1 · 답글 달기

댓글 달기...
[게시]
```

### 23.1 게시글 좋아요
- TanStack Query mutation 사용
- 가능하면 Optimistic Update
- 실패 시 rollback

### 23.2 댓글
- 댓글 등록
- 댓글 좋아요
- 답글 등록
- 삭제

### 23.3 대댓글
Instagram 방식.
UI depth는 한 단계만 표시한다.

```text
댓글
  답글
  답글
  답글
```

답글의 답글도 같은 depth로 병합 표시한다.

### 23.4 삭제
게시글 삭제 성공 후 관련 Query invalidate.
서버에서 게시글/댓글/대댓글/좋아요 관계 삭제를 처리하는 것으로 본다.

---

## 24. My Page

```text
← 마이페이지

프로필 수정

내 활동
게시글 N개 >
좋아요 N개 >
댓글 N개 >

AI 루트 사용 현황
4 / 5회 사용

설정
언어 설정 >
약관 >
로그아웃
```

Phase 2:
- 알림 설정
- 회원 탈퇴

MVP에서 임의 구현하지 않는다.

---

## 25. 내 정보 수정

편집 가능:
- 닉네임
- 프로필 사진

```text
← 내 정보 수정

프로필 이미지
[앨범에서 선택]
[기본 이미지로 변경]

닉네임
[현재닉네임]
[중복확인]

[저장하기]
```

닉네임:
- 디바운스 중복 체크
- 서버 최종 검증

사진:
- 앨범 선택
- 기본 이미지 복구

---

## 26. 내 활동

메뉴:

```text
게시글 12개 >
좋아요 34개 >
댓글 21개 >
```

상세:

```text
[게시글] [좋아요] [댓글]
                  [최신순 ▾]

2026.07.20
...
```

규칙:
- Tabs 또는 Segmented Control
- 최신순 기본
- 원본 게시글 삭제 시 관련 좋아요/댓글 활동도 제거된 서버 결과를 반영

---

## 27. AI 루트 사용현황

```text
4 / 5회

이번 달 사용한 AI 일정 생성 횟수

사용 내역
6/18
6/10
5/28
```

규칙:
- 서버 값 신뢰
- 실패 생성 미포함
- 임의 감소 금지
- 잔여 0회 시 AI 일정 생성 CTA 비활성

---

## 28. 언어 설정

```text
한국어 ✓
English - Phase 2
中文 - Phase 2
日本語 - Phase 2
```

MVP:
- 한국어만 활성
- 별도 저장 버튼 없음

---

## 29. 약관

```text
이용약관 >
개인정보처리방침 >

현재 버전 v1.0.0
```

각 항목은 정적 텍스트 스크롤 화면으로 진입.
별도 동의 버튼 없음.

---

## 30. 로그아웃

```text
로그아웃 하시겠어요?

저장된 일정과 활동 내역은
그대로 유지됩니다.

[취소]
[로그아웃]
```

로그아웃 성공:

```text
세션 제거
→ 소셜 로그인 화면
```

---

## 31. Bottom Navigation

로그인 후 공통 4탭:

```text
메인
일정
커뮤니티
마이페이지
```

현재 route 기준 active 상태 표시.
와이어프레임에서 집중형 화면은 필요 시 Bottom Navigation 숨김 가능.

---

## 32. 공통 UI 컴포넌트

가능하면 아래를 재사용 가능하게 설계한다.

```text
Button
IconButton
Input
SearchInput
Textarea
Select
SegmentedControl
Chip
Badge
Card
Avatar
Tabs
BottomNavigation
Header
PageHeader
Modal
ConfirmDialog
BottomSheet
Loading
EmptyState
ErrorState
Skeleton
```

도메인 컴포넌트와 UI primitive를 분리한다.

---

## 33. Feature 구조 권장

기존 구조와 충돌하지 않을 때:

```text
src/
├─ app/
├─ components/
│  ├─ ui/
│  └─ layout/
├─ features/
│  ├─ auth/
│  ├─ onboarding/
│  ├─ home/
│  ├─ trip/
│  ├─ concert/
│  ├─ itinerary/
│  ├─ community/
│  └─ mypage/
├─ lib/
│  ├─ api/
│  └─ query/
├─ stores/
├─ types/
└─ mocks/
```

---

## 34. API 호출 규칙

페이지 컴포넌트에서 Axios 직접 호출 금지.

예:

```text
features/trip/api/
features/community/api/
features/mypage/api/
```

Query / Mutation hook으로 분리한다.
Query Key factory 사용 권장.

API 명세가 없는 부분은 fake endpoint를 만들지 않는다.

---

## 35. Mock 처리

API가 준비되지 않은 기능은 mock 사용 가능.

금지:
- Component 내부 데이터 하드코딩
- 실제 API처럼 보이는 임의 endpoint 생성

권장:

```text
mocks/
fixtures/
```

API 연결 시 쉽게 제거 가능하게 설계.

---

## 36. UI 상태

모든 주요 화면에서 아래 상태를 고려한다.

```text
Loading
Success
Empty
Error
```

예:

```text
아직 등록된 일정이 없어요.
여행 일정을 만들어보세요.
```

```text
아직 게시글이 없어요.
첫 번째 Fan Route를 공유해보세요.
```

```text
검색 결과가 없습니다.
```

---

## 37. 접근성

필수:
- 클릭 액션 → button
- 페이지 이동 → Link
- 이미지 alt
- Icon button aria-label
- Form label 연결
- Keyboard focus
- disabled 상태 표현
- 클릭 가능한 div 사용 지양
- Modal focus 처리 고려

---

## 38. 모바일 우선

PWA 사용을 고려해 모바일 UI를 우선한다.

예:

```tsx
<main className="mx-auto min-h-dvh w-full max-w-md">
```

Desktop에서도 모바일 App Shell 또는 적절한 max-width를 유지한다.
와이어프레임에 없는 별도 Desktop Dashboard UI를 만들지 않는다.

---

## 39. 구현 우선순위

### Phase 1 — 기반 분석 / 공통 Shell
- 저장소 분석
- Route 구조 확인
- Bottom Navigation
- Header
- 공통 UI

### Phase 2 — Onboarding
- 언어
- 로그인
- 프로필 설정

### Phase 3 — Home
- 일정 없음
- 일정 있음

### Phase 4 — Schedule Create
- 일정 입력
- 공연 검색
- 공연 추천 여부

### Phase 5 — AI Schedule
- 생성 중
- 실패
- 완료
- 아니오 선택 직접 구성

### Phase 6 — Trip Detail / Itinerary
- 여행 일정 상세
- 날짜별 편집
- Kakao Map
- 장소 추가
- 숙박 정보
- 여행 스타일

### Phase 7 — Community
- 게시판 목록
- 검색 / 필터 / 정렬
- 글쓰기
- 게시글 상세
- 좋아요
- 댓글
- 대댓글

### Phase 8 — My Page
- 내 정보 수정
- 내 활동
- AI 사용현황
- 언어
- 약관
- 로그아웃

---

## 40. 테스트 대상

최소 테스트:

### Form
- 도착/출발 Validation
- 닉네임 Validation
- 닉네임 중복 상태

### Flow
- 추천 예 → AI 생성
- 추천 아니오 → 직접 구성
- AI 실패 → 재시도
- AI 실패 → 입력 수정
- AI 완료 → 해당 날짜 편집

### Community
- 게시판 타입 필터
- 최신순 / 인기순
- 좋아요 Toggle
- 댓글 등록
- 답글 depth 표시

### My Page
- 활동 Tab
- 로그아웃 Dialog

E2E 핵심 Flow:

```text
로그인
→ 일정 생성
→ 공연 선택
→ AI 생성
→ 일정 편집
→ Fan Route 공유
```

---

## 41. 작업 완료 검증

현재 `package.json`의 script를 먼저 확인하고 가능한 명령만 실행한다.

우선 확인할 명령:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

오류가 있다면 수정 후 다시 검증한다.

---

## 42. 절대 하지 말 것

1. 숙박 정보를 초기 일정 생성 Step에 추가하지 말 것
2. 여행 스타일을 초기 일정 생성 Step에 추가하지 말 것
3. AI 전체 여행 일정을 한 번에 생성하지 말 것
4. 추천 "아니오"에서 AI 생성 화면으로 이동시키지 말 것
5. AI 실패 시 사용 횟수를 차감하지 말 것
6. 공연 카드를 삭제/변경 가능하게 만들지 말 것
7. 서버 AI 사용 횟수를 클라이언트에서 임의 변경하지 말 것
8. 동행 모집 채택 기능을 MVP 핵심으로 추가하지 말 것
9. Apple / Meta 로그인을 실제 작동하는 것처럼 만들지 말 것
10. English / 中文 / 日本語를 실제 지원하는 것처럼 만들지 말 것
11. API 명세에 없는 Endpoint를 임의 생성하지 말 것
12. 와이어프레임에 없는 복잡한 기능을 임의 추가하지 말 것

---

## 43. Codex용 첫 실행 프롬프트

```text
현재 fanroute-sync-web 저장소에서 Rev.3 와이어프레임 기준으로 프론트엔드를 구현하려고 한다.

저장소에 있는 docs/FANROUTE_REV3_IMPLEMENTATION.md를 먼저 읽고, 바로 코드를 수정하지 말고 현재 프로젝트를 분석해줘.

먼저 아래 내용을 정리해서 보여줘.

1. 현재 App Router 및 디렉터리 구조
2. 이미 구현된 페이지와 기능
3. 재사용 가능한 공통 컴포넌트
4. 기존 Axios API Client / TanStack Query / Zustand 구조
5. 현재 타입 및 API 명세와 와이어프레임 요구사항의 차이
6. 추가해야 할 페이지와 컴포넌트
7. 수정이 필요한 파일 목록
8. Phase 1~8 구현 순서

중요 규칙:
- 기존 프로젝트 구조와 코드 스타일을 우선한다.
- 기존 컴포넌트가 있으면 중복 생성하지 않는다.
- API 명세에 없는 endpoint는 임의로 만들지 않는다.
- API가 없는 기능은 mocks/fixtures로 분리한다.
- 숙박 정보와 여행 스타일은 초기 일정 생성 단계에 포함하지 않는다.
- AI 일정은 전체 여행이 아니라 날짜 1건 단위로 생성한다.
- 공연일 추천에서 '아니오' 선택 시 AI 생성 화면을 건너뛰고 바로 직접 구성 화면으로 이동한다.
- 하단 탭은 메인 / 일정 / 커뮤니티 / 마이페이지 4개다.
- 모바일 우선 PWA UI로 구현한다.

분석이 끝나면 아직 다른 Phase는 수정하지 말고 Phase 1만 구현해줘.

Phase 1 범위:
- 공통 App Shell
- 로그인 이후 4탭 Bottom Navigation
- 공통 Header / PageHeader
- 필요한 최소 공통 UI primitive
- 모바일 max-width layout
- active route 처리

Phase 1 완료 후 아래 형식으로 정리해줘.
- 변경한 파일
- 각 파일의 변경 이유
- 구현한 기능
- 아직 mock인 부분
- API 연동이 필요한 부분
- 다음 Phase에서 할 일

마지막으로 package.json의 script를 확인해서 Phase 1 변경 범위에 대해 가능한 lint / typecheck / test / build 검증을 실행하고 오류가 있으면 수정해줘.
```

---

## 44. Phase별 Codex 요청 예시

### Phase 2

```text
docs/FANROUTE_REV3_IMPLEMENTATION.md를 기준으로 Phase 2 Onboarding만 구현해줘.

범위:
- 언어 선택
- 소셜 로그인
- 프로필 초기 설정

MVP 정책:
- 한국어만 활성
- Google 로그인만 활성
- Apple / Meta는 disabled
- 닉네임 실시간 중복 체크 UI와 상태 처리

기존 Phase 1 컴포넌트를 최대한 재사용하고 다른 Phase 화면은 수정하지 마.
완료 후 변경 파일, 구현 내용, mock/API TODO와 검증 결과를 정리해줘.
```

### Phase 3

```text
docs/FANROUTE_REV3_IMPLEMENTATION.md 기준으로 Phase 3 Home만 구현해줘.

일정 등록 전/후 상태를 모두 구현하고 공통 콘텐츠, D-Day, 오늘 일정, 과거 루트, 추천 루트 영역을 분리해줘.
API가 준비되지 않은 데이터는 fixtures로 분리해줘.
```

### Phase 4

```text
docs/FANROUTE_REV3_IMPLEMENTATION.md 기준으로 Phase 4 일정 생성만 구현해줘.

초기 일정 생성에는 숙박 정보와 여행 스타일을 절대 넣지 말고,
일정 입력 + 공연 선택 → 공연일 추천 여부까지만 구현해줘.
React Hook Form + Zod를 사용하고 날짜/시간 Validation 테스트도 작성해줘.
```

### Phase 5

```text
docs/FANROUTE_REV3_IMPLEMENTATION.md 기준으로 Phase 5 AI 일정 생성 Flow만 구현해줘.

중요:
- 날짜 1건 단위 생성
- 생성 중 / 실패 / 완료 상태
- 추천 '아니오'는 AI 화면 없이 직접 구성 화면으로 이동
- 실패 시 사용 횟수 차감 없음
- API가 아직 없으면 상태 machine/fixture 수준으로 분리하고 fake endpoint는 만들지 마.
```

### Phase 6

```text
docs/FANROUTE_REV3_IMPLEMENTATION.md 기준으로 Phase 6 여행 일정 상세 및 날짜별 일정 편집을 구현해줘.

범위:
- 여행 일정 상세
- 일차별 이동
- 숙박 정보
- 여행 스타일
- 날짜별 Timeline
- 공연 고정 카드
- 일반 장소 변경/삭제
- 장소 추가
- Kakao Map 연동 구조

공연 카드는 변경/삭제 불가로 처리해줘.
```

### Phase 7

```text
docs/FANROUTE_REV3_IMPLEMENTATION.md 기준으로 Phase 7 Fan Route 커뮤니티를 구현해줘.

범위:
- 정보 공유 / 참고 루트 / 동행 모집
- 검색
- 지역 필터
- 최신순/인기순
- 게시글 작성
- 게시글 상세
- 게시글 좋아요
- 댓글 좋아요
- 답글

답글은 Instagram 방식처럼 UI depth 한 단계로만 표시하고,
동행 모집 채택 기능은 MVP에서 제외해줘.
```

### Phase 8

```text
docs/FANROUTE_REV3_IMPLEMENTATION.md 기준으로 Phase 8 마이페이지를 구현해줘.

범위:
- 내 정보 수정
- 프로필 이미지
- 내 활동
- AI 루트 사용현황
- 언어 설정
- 약관
- 로그아웃 확인 Dialog

알림 설정과 회원탈퇴는 Phase 2 기능이므로 구현하지 마.
```

---

## 45. 권장 작업 방식

한 번에 전체 서비스를 구현시키지 않는다.

이 문서를 저장소에 다음 위치로 추가한다.

```text
docs/FANROUTE_REV3_IMPLEMENTATION.md
```

그리고 Codex에는 Phase 단위로 구현을 요청한다.

이 방식의 장점:
- 기존 코드 훼손 가능성 감소
- PR 단위 리뷰 가능
- 와이어프레임과 구현 차이를 빠르게 확인 가능
- API 미완성 영역과 UI 구현 영역 구분 가능
- Codex가 한 번에 너무 많은 코드를 생성하는 문제 방지
