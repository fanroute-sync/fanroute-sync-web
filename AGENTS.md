# AGENTS.md

이 문서는 Codex 및 AI 코딩 도구가 `fanroute-sync-web` 저장소에서 작업할 때 따라야 하는 공통 지침입니다.

## 1. 프로젝트 개요

Fan Route Sync는 부산에서 열리는 K-POP 공연 방문객을 대상으로 공연 전날, 공연 당일, 공연 다음날의 관광 일정을 추천하고 공유하는 반응형 웹 서비스입니다.

### MVP 주요 기능

- Google OAuth 로그인

- 닉네임 중복 확인 및 프로필 이미지 설정

- 부산 도착·출발 일시 입력

- 공연 검색 및 선택

- 공연일 추천 일정 템플릿 적용

- 숙박 정보와 여행 스타일 입력

- Gemini 기반 AI 관광 루트 생성

- 카카오맵 기반 일정 조회 및 편집

- TourAPI 기반 관광지 및 음식점 검색

- 정보공유·참고루트·동행모집 커뮤니티

- 저장한 일정, 내 게시글, AI 사용 횟수 확인

### MVP 제외 기능

- Apple 및 Meta 로그인

- 다국어 지원

- 실시간 채팅

- 실시간 공연 정보 API

- 커뮤니티 일정 딥링크 복사

- 회원 탈퇴

- 알림 설정

기획에 없는 Phase 2 기능을 임의로 구현하지 않습니다.

## 2. 기술 스택

### Core

- Next.js App Router

- React

- TypeScript

- Tailwind CSS

- pnpm

### 상태 및 데이터

- TanStack Query: 서버 상태 관리

- Zustand: 여러 화면에서 공유되는 클라이언트 상태

- React Hook Form: 폼 상태 관리

- Zod: 폼 및 API 데이터 검증

- Axios: Spring Boot API 통신

### UI

- clsx

- tailwind-merge

- class-variance-authority

- Lucide React

- Sonner

- date-fns

### 외부 연동

- Spring Boot REST API

- Google OAuth

- 카카오맵 JavaScript SDK

- 한국관광공사 TourAPI

- Gemini API

Gemini API와 TourAPI는 프론트엔드에서 직접 호출하지 않고 Spring Boot 백엔드를 통해 호출합니다.

## 3. 명령어

```bash

pnpm install

pnpm dev

pnpm lint

pnpm typecheck

pnpm build

```

테스트 환경이 추가된 이후에는 다음 명령어도 사용합니다.

```bash

pnpm test

pnpm test:watch

pnpm test:e2e

```

작업 완료 전 가능한 범위에서 다음 명령어를 실행합니다.

```bash

pnpm lint

pnpm typecheck

pnpm build

```

명령어를 실행하지 못한 경우 작업 결과에 이유를 작성합니다.

## 4. 디렉터리 구조

```text

src/

├── app/

├── components/

│   ├── common/

│   ├── layout/

│   └── ui/

├── features/

├── hooks/

├── lib/

│   ├── api/

│   ├── auth/

│   ├── query/

│   ├── kakao-map/

│   └── utils/

├── constants/

└── types/

```

기능 디렉터리는 다음 구조를 기준으로 합니다.

```text

src/features/trip-plan/

├── api/

├── model/

├── ui/

└── index.ts

```

### 구조 원칙

- `app/`: 라우팅, 레이아웃, 페이지 조합

- `features/`: 도메인별 API, UI, 타입, 비즈니스 로직

- `components/ui/`: 도메인과 무관한 재사용 UI

- `components/common/`: 여러 기능에서 사용하는 프로젝트 공통 컴포넌트

- `lib/api/`: Axios 인스턴스, 공통 응답 타입, API 에러 처리

- `lib/query/`: QueryClient 설정

- `types/`: 여러 기능에서 공유하는 타입

하나의 화면에서만 사용하는 코드를 불필요하게 공통화하지 않습니다.

## 5. Next.js 규칙

- App Router를 사용합니다.

- 기본적으로 Server Component를 사용합니다.

- 이벤트, React Hook, 브라우저 API가 필요할 때만 `"use client"`를 추가합니다.

- `page.tsx`에는 복잡한 비즈니스 로직을 작성하지 않습니다.

- 페이지는 데이터 준비와 feature 컴포넌트 조합을 담당합니다.

- 서버 전용 환경변수와 비밀키를 클라이언트에 노출하지 않습니다.

- `NEXT_PUBLIC_` 환경변수에는 공개 가능한 값만 사용합니다.

- `window`, `document`, 카카오맵 SDK는 클라이언트 환경에서만 접근합니다.

- 필요한 화면에 loading, empty, error 상태를 구현합니다.

- 자동 생성 파일은 직접 수정하지 않습니다.

## 6. API 규칙

Base URL:

```text

/api/v1

```

성공 응답:

```json
{
  "data": {},

  "error": null
}
```

실패 응답:

```json
{
  "data": null,

  "error": {
    "code": "ERROR_CODE",

    "message": "오류 메시지"
  }
}
```

### API 처리 원칙

- 인증이 필요한 요청에는 JWT를 적용합니다.

- API 타입에 `any`를 사용하지 않습니다.

- 외부 데이터는 필요한 경우 Zod로 검증합니다.

- 날짜와 일시는 ISO 8601 형식을 유지합니다.

- 서버 상태를 Zustand에 중복 저장하지 않습니다.

- API 요청은 특별한 이유가 없다면 공통 Axios 인스턴스를 사용합니다.

### 주요 에러 코드

- `NICKNAME_DUPLICATE`: 닉네임 필드 오류 표시

- `AI_ROUTE_LIMIT_EXCEEDED`: AI 생성 버튼 비활성화

- `EXTERNAL_API_UNAVAILABLE`: 재시도와 수동 입력 경로 표시

- `UNAUTHORIZED`: 인증 만료 처리

- `NOT_FOUND`: 존재하지 않는 리소스 처리

### TanStack Query 규칙

- 조회는 `useQuery`를 사용합니다.

- 생성·수정·삭제는 `useMutation`을 사용합니다.

- query key는 각 feature의 key factory에서 관리합니다.

- mutation 완료 후 관련 query만 정확히 무효화합니다.

- 컴포넌트 내부에 query key 문자열을 반복 작성하지 않습니다.

## 7. 상태 관리 우선순위

1. URL로 표현할 수 있는 상태는 search params

2. 서버 데이터는 TanStack Query

3. 폼 상태는 React Hook Form

4. 단일 컴포넌트 상태는 `useState`

5. 여러 화면에서 공유하는 클라이언트 상태만 Zustand

TanStack Query의 서버 데이터를 Zustand에 복사하지 않습니다.

## 8. TypeScript 규칙

- `strict` 모드를 유지합니다.

- `any` 사용을 금지합니다.

- 외부 데이터는 `unknown`으로 받고 검증합니다.

- API DTO와 View Model을 필요한 경우 분리합니다.

- 컴포넌트 Props 타입을 명시합니다.

- enum 값은 타입 또는 상수로 관리합니다.

- 불필요한 타입 단언을 피합니다.

- non-null assertion인 `!` 사용을 피합니다.

## 9. UI 및 접근성

- 클릭 기능은 `button` 요소로 구현합니다.

- 아이콘 버튼에는 `aria-label`을 제공합니다.

- 입력 필드에는 연결된 `label`을 제공합니다.

- 모달은 포커스 이동, Escape 닫기, 배경 스크롤을 고려합니다.

- 로딩, 빈 상태, 오류 상태를 구현합니다.

- 모바일 화면을 우선 확인합니다.

- 지도와 함께 텍스트 장소 목록을 제공합니다.

- 이미지에는 적절한 대체 텍스트를 작성합니다.

- 내부 오류 메시지와 스택 트레이스를 사용자에게 노출하지 않습니다.

## 10. 테스트 규칙

우선 테스트 대상:

- 날짜와 시간 변환

- AI 루트 잔여 횟수 처리

- 일정 순서 변경

- API 에러 코드별 UI

- 닉네임 입력 검증

- 커뮤니티 필터와 정렬

핵심 E2E 플로우:

```text

로그인

→ 닉네임 설정

→ 여행 설문

→ 일정 생성

→ AI 루트 생성

→ 일정 확인

→ 커뮤니티 게시글 작성

```

외부 API는 테스트에서 직접 호출하지 않고 MSW 또는 테스트 서버로 대체합니다.

버그 수정 시 가능한 경우 재현 테스트를 추가합니다.

## 11. 커밋 메시지

Conventional Commits 형식을 사용합니다.

```text

<type>: <변경 사항 요약>



<필요한 경우 상세 설명>



Refs #이슈번호

```

이슈를 자동 종료할 경우:

```text

Closes #이슈번호

```

### 커밋 타입

- `feat`: 새로운 기능 추가

- `fix`: 버그 수정

- `docs`: README 등 문서 수정

- `style`: 동작 변경 없는 코드 포맷 수정

- `refactor`: 기능 변경 없는 구조 개선

- `test`: 테스트 코드 추가 또는 수정

- `chore`: 빌드, 패키지, 설정, CI 변경

### 작성 규칙

- 제목 끝에 마침표를 붙이지 않습니다.

- 변경 목적이 드러나도록 구체적으로 작성합니다.

- 하나의 커밋에는 하나의 목적만 포함합니다.

- `수정`, `작업`, `완료`처럼 모호한 제목을 사용하지 않습니다.

- 이슈가 있으면 커밋 본문 마지막에 연결합니다.

예시:

```text

feat: 공연 검색 및 선택 기능 추가



공연명과 공연장 기준으로 공연을 검색하고

선택 결과를 여행 설문에 반영했습니다.



Refs #12

```

## 12. 브랜치 규칙

```text

feat/이슈번호-설명

fix/이슈번호-설명

docs/이슈번호-설명

style/이슈번호-설명

refactor/이슈번호-설명

test/이슈번호-설명

chore/이슈번호-설명

```

예시:

```text

feat/12-concert-search

fix/27-ai-route-limit

chore/4-coderabbit-config

```

브랜치 설명은 영문 kebab-case로 작성합니다.

## 13. 작업 전 체크리스트

- 관련 이슈와 요구사항 확인

- API 명세와 디자인 확인

- 현재 브랜치와 working tree 확인

- 기존 구현과 재사용 가능한 코드 검색

- 최소 변경 범위 결정

## 14. 작업 완료 체크리스트

- [ ] 요구사항 반영 확인

- [ ] 모바일과 데스크톱 확인

- [ ] 로딩·빈 상태·오류 상태 확인

- [ ] TypeScript 오류 확인

- [ ] 린트 실행

- [ ] 관련 테스트 실행

- [ ] 프로덕션 빌드 확인

- [ ] 불필요한 로그 제거

- [ ] 민감정보 노출 확인

- [ ] 문서 변경 필요 여부 확인

- [ ] 커밋 메시지 확인

- [ ] PR 테스트 방법 작성

## 15. 금지사항

- 패키지 매니저를 pnpm 외 도구로 변경하지 않습니다.

- `pnpm-lock.yaml`을 삭제하지 않습니다.

- npm 또는 yarn lock 파일을 추가하지 않습니다.

- API 키와 토큰을 하드코딩하지 않습니다.

- Gemini API와 TourAPI를 브라우저에서 직접 호출하지 않습니다.

- 서버 데이터를 Zustand에 중복 저장하지 않습니다.

- 불필요하게 `"use client"`를 추가하지 않습니다.

- 관련 없는 대규모 리팩터링을 하지 않습니다.

- 테스트를 통과시키기 위해 테스트를 삭제하거나 skip하지 않습니다.

- 존재하지 않는 API를 임의로 가정하지 않습니다.

- Phase 2 기능을 임의로 구현하지 않습니다.

## 16. 작업 결과 보고

AI 도구는 작업 완료 후 다음 내용을 보고합니다.

1. 변경한 내용

2. 변경한 주요 파일

3. 실행한 검증 명령어와 결과

4. 실행하지 못한 항목과 이유

5. 남은 문제 또는 후속 작업
