# Fan Route Sync Frontend API Integration Codex Task

## 1. Goal

현재 프론트엔드 프로젝트의 기존 구현을 먼저 확인한 뒤, 아래 백엔드 API 명세를 기준으로 실제 API 연동 구조를 정리하고 필요한 파일만 수정한다.

무작정 새 구조를 만들지 말고, 기존의 다음 요소를 우선 재사용한다.

- Next.js App Router
- 기존 `src/features/**` 구조
- 기존 `src/lib/api/**` 공통 API 클라이언트
- 기존 TanStack Query 설정
- 기존 Zustand 사용 방식
- 기존 라우팅/온보딩/일정/커뮤니티 UI
- 기존 환경 변수 이름
- 기존 타입/응답 처리 방식
- 기존 테스트 코드와 fixture/mock 구조

작업 전 반드시 현재 소스 코드를 조사하고, 이미 구현된 API/타입/훅/컴포넌트는 중복 생성하지 않는다.

---

## 2. Backend API Base Rules

### Base URL

```text
/api/v1
```

로컬 프론트 환경에서는 다음 값을 사용한다.

```env
NEXT_PUBLIC_API_BASE_URL=http://192.168.200.180:8080/api/v1
```

프론트는 프론트 PC에서 다음 주소로 실행한다.

```text
http://localhost:3000
```

### Common response format

```ts
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  code: string;
  message: string;
  data: T;
}
```

실패 예시:

```json
{
  "success": false,
  "status": 401,
  "code": "AUTH_GOOGLE_CODE_INVALID",
  "message": "Google 인가 코드가 유효하지 않습니다.",
  "data": null
}
```

입력값 검증 실패는 주로 `COMMON_INVALID_PARAMETER`이며 `data`에 필드 오류 목록이 포함될 수 있다.

---

## 3. Important Constraints

1. Client Secret은 절대 프론트 코드 또는 `NEXT_PUBLIC_*` 환경 변수에 넣지 않는다.
2. Google OAuth는 Authorization Code 방식으로 처리한다.
3. JWT가 필요한 API는 `Authorization: Bearer {accessToken}` 헤더를 사용한다.
4. Refresh Token은 프론트 JS에서 직접 읽지 않는다.
5. Refresh Token은 백엔드가 HttpOnly Cookie로 관리한다.
6. Refresh/Logout 요청에는 `X-Requested-With: XMLHttpRequest` 헤더가 필요하다.
7. Cookie 기반 인증 요청을 위해 필요한 경우 기존 Axios 인스턴스에 `withCredentials: true`를 적용한다.
8. 기존 fixture/mock UI가 있으면 실제 API 연동 이후에도 데모가 깨지지 않도록 구조를 확인한다.
9. `any`를 새로 추가하지 않는다.
10. 기존 컴포넌트에 API 호출을 직접 흩뿌리지 말고 현재 feature/API/query 구조를 따른다.
11. 기존 경로와 컴포넌트 이름을 우선 재사용한다.
12. API 명세에 없는 필드를 임의로 가정하지 않는다.
13. 명세와 실제 Swagger 응답이 다르면 실제 구현을 우선하고 작업 결과에 차이를 기록한다.

---

## 4. First Step: Inspect Existing Frontend

코드 수정 전에 아래 항목을 먼저 조사한다.

```text
package.json
src/app/**
src/features/**
src/lib/api/**
src/lib/auth/**
src/lib/query/**
src/types/**
.env.example
AGENTS.md
```

특히 아래 내용을 확인한다.

- 기존 Axios client 위치와 설정
- Access Token 저장 방식
- Axios request/response interceptor
- `withCredentials` 설정 여부
- 인증 실패 처리 방식
- Google 로그인 버튼 구현
- `/auth/callback` 구현
- `state` 생성 및 검증 방식
- 기존 로그인 API 함수
- 프로필 설정 화면 실제 URL
- 로그인 성공 후 홈 URL
- 사용자 정보 저장 방식
- TanStack Query key factory 존재 여부
- 기존 trip plan API 구현 여부
- fixture/mock 전환 구조
- 현재 사용 중인 backend response type

조사 결과를 바탕으로 **최소 수정 계획을 먼저 세운 뒤 구현한다.**

---

## 5. Environment Variables

현재 `.env.example`은 다음 구조를 유지한다.

```env
# Mock demo deployments do not require environment variables.
# Configure the values below only when each real integration is enabled.

# Spring Boot API base URL (example: https://api.example.com/api/v1)
# Optional for the current fixture/mock demo.
NEXT_PUBLIC_API_BASE_URL=

# Google OAuth public client ID. Register these exact redirect URIs in Google Cloud:
# http://localhost:3000/auth/callback
# https://sparkling-alfajores-f44fd5.netlify.app/auth/callback
NEXT_PUBLIC_GOOGLE_CLIENT_ID=

# Reserved for the future Kakao Map JavaScript SDK integration; currently unused.
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=
```

로컬 `.env.local`은 현재 다음 값이 사용된다.

```env
NEXT_PUBLIC_API_BASE_URL=http://192.168.200.180:8080/api/v1
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=실제_카카오_자바스크립트_키
NEXT_PUBLIC_GOOGLE_CLIENT_ID=545962993267-v7asmvc64j9b3je76k3gpaisi6jg0hsa.apps.googleusercontent.com
```

`.env.local`을 커밋하지 않는다.

필요하면 아래 명령으로 ignore 상태를 확인한다.

```bash
git check-ignore -v .env.local
```

---

## 6. Google OAuth Integration

현재 Google 로그인 구현이 이미 존재하므로 처음부터 새로 만들지 말고 현재 구현을 확인 후 보완한다.

로그인 버튼 클릭 시 Google OAuth 인증 URL로 이동한다.

로컬 callback:

```text
http://localhost:3000/auth/callback
```

배포 callback:

```text
https://sparkling-alfajores-f44fd5.netlify.app/auth/callback
```

Google OAuth 요청에는 다음 값을 포함한다.

```text
client_id
redirect_uri
response_type=code
scope=openid email profile
state
```

### state

- 로그인 요청마다 새로운 cryptographically random state를 생성한다.
- 가능하면 `crypto.randomUUID()` 또는 `crypto.getRandomValues()`를 사용한다.
- state는 `sessionStorage` 등 현재 구현과 가장 맞는 브라우저 저장소에 임시 저장한다.
- callback에서 반드시 비교한다.
- 검증 성공/실패와 관계없이 저장된 state는 재사용되지 않도록 제거한다.
- 동일 callback effect가 React Strict Mode 등으로 중복 실행되지 않도록 방어한다.

---

## 7. Google OAuth Callback

경로:

```text
/auth/callback
```

쿼리에서 `code`, `state`, `error`를 읽는다.

처리 순서:

1. Google이 `error`를 반환했다면 로그인 화면으로 이동한다.
2. 저장된 state와 쿼리 state를 비교한다.
3. state가 없거나 다르면 API를 호출하지 않는다.
4. state는 한 번만 소비한다.
5. `code`가 없으면 실패 처리한다.
6. 유효하면 아래 API를 호출한다.

```http
POST /api/v1/auth/google
Content-Type: application/json
```

요청:

```json
{
  "authorizationCode": "GOOGLE_AUTHORIZATION_CODE"
}
```

주의:

- Authorization Code는 재사용하지 않는다.
- callback 새로고침 때문에 같은 code가 다시 전송되지 않도록 막는다.
- Client Secret은 프론트에 두지 않는다.

---

## 8. Google Login API

```http
POST /auth/google
```

인증 없음.

요청:

```ts
interface GoogleLoginRequest {
  authorizationCode: string;
}
```

응답은 반드시 실제 Swagger/백엔드 구현을 확인해서 타입을 정의한다.

명세 기준으로 로그인 성공 시:

- Access Token: response body
- 사용자 정보: response body
- Refresh Token: HttpOnly Cookie

기존 코드가 `data.accessToken`, `data.isNewUser` 등을 사용 중이라면 실제 Swagger 응답과 비교한다. 실제 응답 필드가 다르면 실제 구현에 맞춘다.

로그인 성공 후:

```text
신규 사용자 또는 프로필 설정 필요
→ 기존 프로필 설정 화면

기존 사용자
→ 기존 홈 화면
```

정확한 분기 필드는 Swagger 또는 실제 응답 DTO에서 확인한다.

---

## 9. Access Token Handling

기존 Access Token 저장 방식을 우선 사용한다.

현재 프로젝트가 localStorage를 사용하고 있다면 중간에 임의로 다른 저장 방식으로 바꾸지 않는다.

공통 API client에서 JWT 요청 시:

```http
Authorization: Bearer {accessToken}
```

을 자동으로 붙인다.

로그인 성공 시 Access Token을 저장하고, 로그아웃 성공 시 제거하고, Refresh 성공 시 새 Access Token으로 교체한다.

---

## 10. Refresh Token

```http
POST /auth/token/refresh
```

인증: Refresh Token HttpOnly Cookie

필수 헤더:

```http
X-Requested-With: XMLHttpRequest
```

요청 body는 명세에 없으므로 빈 body 또는 기존 백엔드 요구사항을 따른다.

응답으로 새 Access Token을 받으면 저장한다.

Refresh Token은 JS에서 읽거나 localStorage에 저장하지 않는다.

---

## 11. Logout

```http
POST /auth/logout
```

인증: Refresh Token HttpOnly Cookie

필수 헤더:

```http
X-Requested-With: XMLHttpRequest
```

성공 시:

- local Access Token 제거
- auth 관련 query cache 정리
- 로그인 화면 또는 기존 public home으로 이동

---

## 12. Axios Client

기존 `src/lib/api/client.ts`를 조사하고 필요한 부분만 수정한다.

검토 항목:

```text
baseURL
timeout
Content-Type
withCredentials
Authorization interceptor
401 handling
refresh retry handling
```

Cookie 기반 Refresh Token을 위해 browser request에는 `withCredentials: true`가 필요할 수 있다.

Refresh/Logout에는 반드시 `X-Requested-With: XMLHttpRequest` 헤더를 붙인다.

무한 refresh loop가 생기지 않도록 다음 요청은 다시 refresh하지 않게 한다.

- 로그인 API 401
- refresh API 401
- 이미 retry한 요청

기존 프로젝트에 refresh interceptor가 없다면 지나치게 복잡한 구조를 만들지 말고 최소 안정 구조로 구현한다.

---

## 13. Local Cookie / CORS Warning

현재 로컬 구성:

```text
Frontend
http://localhost:3000

Backend
http://192.168.200.180:8080
```

두 origin은 다르다.

프론트에서 `withCredentials: true`를 사용할 경우 백엔드 CORS에 최소 다음이 필요하다.

```text
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

credentials 사용 시 `Access-Control-Allow-Origin: *`를 사용하면 안 된다.

또한 Refresh Token이 cross-site HttpOnly Cookie인 경우 HTTP 환경에서 `SameSite=None; Secure` 정책 때문에 쿠키 저장/전송이 정상 동작하지 않을 수 있다.

이 문제는 프론트 코드만으로 해결할 수 없다.

작업 결과에 다음을 반드시 기록한다.

- 현재 프론트 설정
- 로그인 POST 성공 여부
- Refresh Cookie가 실제 브라우저에 저장되는지 여부
- local HTTP 환경에서 막히는 경우 백엔드/환경 문제임을 명시
- production에서는 HTTPS API가 필요함

---

## 14. Auth Errors

인증 관련 주요 오류 코드를 공통 에러 처리에 반영한다.

```text
GOOGLE_AUTHORIZATION_CODE_INVALID
GOOGLE_ID_TOKEN_INVALID
GOOGLE_API_UNAVAILABLE
REFRESH_TOKEN_INVALID
CSRF_HEADER_REQUIRED
USER_SUSPENDED
USER_WITHDRAWN
```

기존 백엔드에서 실제 코드가 아래처럼 `AUTH_` prefix를 사용하는 경우가 있다.

```text
AUTH_GOOGLE_CODE_INVALID
```

Swagger/실제 구현을 확인하여 실제 코드 기준으로 처리한다. 문서와 코드가 다른 경우 작업 결과에 차이를 기록한다.

---

## 15. User APIs

모두 JWT 필요.

### GET /users/me

내 프로필 조회.

응답 주요 항목:

- 사용자 ID
- nickname
- email
- login provider
- status

기존 마이페이지나 auth initialization에 연결할 수 있는지 확인한다.

### GET /users/nickname-availability?nickname={nickname}

응답:

- normalized nickname
- available

기존 프로필 설정 화면의 닉네임 중복 확인에 연결한다. 기존 debounce 로직이 있으면 재사용한다.

### PATCH /users/me

요청:

```json
{
  "nickname": "newNickname"
}
```

성공 후 `users/me` query를 invalidate한다.

---

## 16. Concert APIs

공개 API.

### GET /concerts?genreName=&page=0&size=20

- 종료되지 않은 공연
- 시작일 순
- size 최대 100

장르:

```text
연극
무용(서양/한국무용)
대중무용
서양음악(클래식)
한국음악(국악)
대중음악
복합
서커스/마술
뮤지컬
```

기존 공연 선택 UI에 연결한다.

### GET /concerts/{concertId}

공연 상세.

### GET /concert-schedules?concertId={id}

공연 회차를 날짜/시각 순으로 조회한다. 기존 여행 일정 생성 플로우에서 공연 선택 이후 회차 선택이 필요한지 현재 UI와 비교한다.

---

## 17. Place APIs

공개 API.

### GET /places?category=&page=0&size=20

부산 장소 목록. 기존 fixture 장소 UI가 있으면 실제 API로 교체한다.

### GET /places/{placeId}

장소 상세.

---

## 18. Trip Plan APIs

모두 JWT 필요.

### POST /trip-plans

요청 필드:

```text
arrivalDate
arrivalTimeSlot
departureDate
departureTimeSlot
concertId (optional)
```

```ts
type TimeSlot = "MORNING" | "AFTERNOON" | "EVENING";
```

기존 여행 설문 UI 필드와 매핑한다.

프론트 UI가 현재 정확한 시간을 입력받고 있다면 백엔드 DTO에 맞춰 time slot으로 변환할지, UI를 수정할지 현재 기획과 코드를 확인한 뒤 최소 변경한다.

### GET /trip-plans

내 여행 일정 목록.

응답 주요 데이터:

- trip plan ID
- concert
- title
- arrival datetime
- departure datetime

기존 마이페이지 일정 목록과 연결한다.

### GET /trip-plans/{tripPlanId}

여행 일정 상세. 기존 일정 상세 페이지에 연결한다.

### DELETE /trip-plans/{tripPlanId}

성공 후 관련 query invalidate.

---

## 19. Itinerary Day

```http
GET /trip-plans/{tripPlanId}/itinerary-days/{date}
```

`date`는 ISO date 문자열.

예:

```text
2026-09-20
```

응답:

- date
- concert day 여부
- itinerary items

---

## 20. Itinerary Items

### POST /itinerary-days/{dayId}/items

요청:

```ts
interface CreateItineraryItemRequest {
  type: string;
  scheduledTime: string;
  title: string;
  durationMinutes: number;
  placeId?: number;
}
```

정확한 `type` enum은 Swagger를 확인해 실제 타입으로 정의한다.

### PATCH /itinerary-items/{itemId}

수정 가능:

- time
- title
- duration
- placeId

### DELETE /itinerary-items/{itemId}

공연 고정 항목은 수정/삭제할 수 없다.

`FIXED_ITINERARY_ITEM` 발생 시 사용자에게 의미 있는 메시지를 표시한다.

### PATCH /itinerary-days/{dayId}/items/order

요청:

```json
{
  "itemIds": [1, 2, 3]
}
```

기존 drag & drop 또는 순서 변경 UI가 있으면 해당 mutation에 연결한다.

---

## 21. AI Itinerary Generation

모두 JWT 필요. AI 생성은 비동기 작업이다.

### POST /itinerary-days/{itineraryDayId}/ai-generations

성공: `202 Accepted`

응답 주요 값:

```text
generationId
PENDING
```

### GET /ai-itinerary-generations/{generationId}

```ts
type AiGenerationStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";
```

기존 AI 생성 진행 화면이 있다면 polling 구조를 연결한다.

TanStack Query를 사용하는 경우 현재 프로젝트 패턴에 맞게 polling한다.

- `PENDING`, `PROCESSING`: refetch 유지
- `COMPLETED`, `FAILED`, `CANCELLED`: polling 중단

### POST /ai-itinerary-generations/{generationId}/retry

성공: `202`

### DELETE /ai-itinerary-generations/{generationId}

PENDING 상태 작업만 취소 가능.

주요 오류:

```text
AI_ITINERARY_GENERATION_NOT_FOUND
INVALID_AI_ITINERARY_GENERATION_STATUS
AI_ITINERARY_GENERATION_UNAVAILABLE_ON_CONCERT_DAY
AI_ITINERARY_GENERATION_LIMIT_EXCEEDED
```

정책:

- 새 여행 일정은 AI 추천 5회
- 실패/취소된 대기 작업은 횟수 미사용
- 최종 실패 시 예약 횟수 반환

기존 UI의 남은 생성 횟수 표시 구조와 실제 응답 필드를 확인하여 연결한다.

---

## 22. Admin APIs

현재 일반 사용자 프론트에서 관리자 기능을 사용하지 않는다면 구현하지 않는다.

```text
POST /admin/concerts/sync
POST /admin/concert-schedules
PUT /admin/concert-schedules/{scheduleId}
DELETE /admin/concert-schedules/{scheduleId}
POST /admin/places/sync
GET /admin/jobs/{jobName}/executions
```

기존 관리자 화면이 있을 때만 연결한다.

---

## 23. Query Structure

기존 feature 구조와 naming을 그대로 유지한다.

기존 key factory가 없다면 다음 정도의 구조만 도입한다.

```ts
usersKeys.me()

concertKeys.list(params)
concertKeys.detail(id)
concertKeys.schedules(concertId)

placeKeys.list(params)
placeKeys.detail(id)

tripPlanKeys.list()
tripPlanKeys.detail(id)
tripPlanKeys.day(tripPlanId, date)

aiGenerationKeys.detail(generationId)
```

컴포넌트에 query key 문자열을 직접 반복하지 않는다.

---

## 24. Mock / Fixture Migration

현재 프로젝트가 fixture/mock 데이터 중심이라면 한 번에 모두 제거하지 않는다.

다음 순서로 실제 API를 연결한다.

1. Auth
2. User profile / nickname
3. Concert
4. Trip Plan
5. Itinerary
6. AI generation
7. Place

API 연결이 완료된 화면부터 fixture 의존성을 제거한다.

아직 백엔드 필드가 부족하거나 UI와 명세가 맞지 않는 화면은 기존 fixture를 유지하고 TODO를 기록한다.

---

## 25. UI State

각 실제 API 화면에는 최소 다음 상태를 처리한다.

```text
loading
success
empty
error
```

mutation은 필요 시 `idle`, `pending`, `success`, `error`를 반영한다.

기존 공통 loading/error 컴포넌트가 있으면 재사용한다.

---

## 26. Error Handling

공통 API 에러에서 아래 값을 추출할 수 있도록 한다.

```ts
interface BackendErrorResponse {
  success: false;
  status: number;
  code: string;
  message: string;
  data?: unknown;
}
```

특정 코드에는 사용자 친화 메시지를 매핑한다.

```text
COMMON_INVALID_PARAMETER
→ 입력값을 확인해주세요.

GOOGLE_AUTHORIZATION_CODE_INVALID
→ Google 로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요.

REFRESH_TOKEN_INVALID
→ 로그인 세션이 만료되었습니다. 다시 로그인해주세요.

USER_SUSPENDED
→ 이용이 제한된 계정입니다.

USER_WITHDRAWN
→ 탈퇴 처리된 계정입니다.

AI_ITINERARY_GENERATION_LIMIT_EXCEEDED
→ AI 일정 생성 가능 횟수를 모두 사용했습니다.

FIXED_ITINERARY_ITEM
→ 공연 일정은 수정하거나 삭제할 수 없습니다.
```

백엔드 `message`를 무조건 그대로 노출하지 말고 기존 UX 규칙을 따른다.

---

## 27. Route Protection

현재 프로젝트의 auth guard/router 방식을 먼저 확인한다.

JWT가 필요한 페이지는 미인증 상태에서 보호한다.

단, Next.js Middleware에서 localStorage Access Token을 읽는 방식은 사용하지 않는다.

현재 Access Token이 localStorage 기반이면 client-side auth initialization 또는 기존 guard 구조를 유지한다.

새로운 인증 아키텍처를 임의로 추가하지 않는다.

---

## 28. Verification

수정 완료 후 프로젝트에 존재하는 명령어 기준으로 가능한 검증을 모두 실행한다.

우선:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

스크립트 이름이 다르면 `package.json`을 확인해서 실제 스크립트를 실행한다.

E2E가 설정되어 있고 환경이 허용되면 관련 smoke test도 실행한다.

---

## 29. Manual Google Login Verification

가능한 경우 브라우저에서 다음을 확인한다.

1. `http://localhost:3000` 실행
2. Google 로그인 버튼 클릭
3. Google 인증 페이지 이동
4. 인증 URL의 Client ID 확인
5. `redirect_uri=http://localhost:3000/auth/callback` 확인
6. callback에 새 `code`, `state`가 전달되는지 확인
7. state 검증 성공 여부
8. `POST /api/v1/auth/google` 발생 여부
9. request body 확인

```json
{
  "authorizationCode": "..."
}
```

10. Access Token 저장 여부
11. 신규 사용자/기존 사용자 라우팅
12. Refresh Token Cookie 저장 여부
13. 이후 JWT API 요청 Authorization header 확인

Authorization Code는 1회용이므로 같은 callback URL을 새로고침해서 재사용하지 않는다.

---

## 30. Known Local Environment Issue

현재 프론트와 백엔드는 서로 다른 PC이다.

```text
Frontend PC
http://localhost:3000

Backend PC
http://192.168.200.180:8080
```

이미 다음 CORS 오류가 발생한 적이 있다.

```text
The value of the 'Access-Control-Allow-Credentials' header
must be 'true' when the request's credentials mode is 'include'
```

따라서 API 실패 시 프론트 문제라고 바로 판단하지 말고 아래를 구분한다.

```text
CORS
OAuth redirect_uri
Authorization Code
Cookie SameSite/Secure
백엔드 API 오류
프론트 타입/파싱 오류
```

Google 로그인에서 다음 응답이 발생한 적도 있다.

```json
{
  "success": false,
  "status": 401,
  "code": "AUTH_GOOGLE_CODE_INVALID",
  "message": "Google 인가 코드가 유효하지 않습니다."
}
```

이 경우 확인할 항목:

- 프론트 Google 인증 요청의 redirect_uri
- 백엔드 Google token exchange의 redirect_uri
- 둘이 정확히 동일한지
- 동일 authorization code가 중복 사용되지 않았는지
- Google Client ID/Secret 조합이 같은 OAuth Client인지
- Google token endpoint 실제 에러 로그

이 오류 자체를 프론트에서 우회하거나 숨기지 않는다.

---

## 31. Scope of This Task

이번 작업에서 우선 실제 연동을 진행할 범위:

```text
1. Google OAuth
2. Access Token 처리
3. Refresh/Logout 기반 구조
4. User profile / nickname API
5. Concert 조회
6. Trip Plan CRUD
7. Itinerary CRUD / reorder
8. AI generation async flow
9. Place 조회
```

Admin API는 현재 일반 프론트에서 필요하지 않으면 제외한다.

---

## 32. Do Not Do

- 전체 UI 재작성
- 디자인 변경
- 임의의 페이지 추가
- API 명세에 없는 서버 필드 가정
- Client Secret 추가
- Google Token Endpoint를 프론트에서 직접 호출
- Refresh Token을 localStorage에 저장
- 기존 fixture를 이유 없이 전부 삭제
- 기존 TanStack Query/Zustand 구조를 이유 없이 갈아엎기
- 백엔드 API 문제를 프론트에서 임의 우회
- 테스트 실패 상태로 작업 완료 처리

---

## 33. Completion Report

작업이 끝나면 아래 형식으로 결과를 출력한다.

### 조사 결과

- 기존 인증 구조
- 기존 API client
- 기존 token 처리
- 기존 fixture/mock 구조
- 기존 화면과 API 명세의 차이

### 수정한 파일

각 파일마다:

```text
path
- 수정 이유
- 핵심 변경
```

### 연동된 API

예:

```text
✅ POST /auth/google
✅ POST /auth/token/refresh
✅ POST /auth/logout
```

실제 구현하지 못한 API는:

```text
⚠️ 미연동: 이유
```

로 기록한다.

### 검증 결과

```text
lint:
typecheck:
test:
build:
```

### 브라우저 연동 결과

```text
Google OAuth:
Access Token:
Refresh Cookie:
Authenticated API:
```

### 남은 이슈

특히 다음은 반드시 별도로 기록한다.

```text
- 백엔드 Swagger와 실제 응답 차이
- 로컬 CORS
- Refresh Token Cookie
- HTTP / HTTPS 문제
- OAuth redirect_uri
- 아직 fixture를 사용하는 화면
```

---

## 34. Final Instruction

먼저 코드를 조사한다.

바로 대규모 수정하지 않는다.

현재 구현을 최대한 살린 상태에서 백엔드 명세와 맞지 않는 부분만 수정하고 실제 API 연동을 진행한다.

한 번에 모든 화면을 무리하게 바꾸지 말고 인증 → 사용자 → 공연 → 일정 → AI → 장소 순서로 연결하면서 각 단계마다 타입 검사 가능한 상태를 유지한다.

작업 완료 후 반드시 변경 파일 목록과 검증 결과를 보고한다.
