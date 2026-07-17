# Git Convention

## 1. 브랜치 규칙

```text

feat/이슈번호-설명

fix/이슈번호-설명

docs/이슈번호-설명

style/이슈번호-설명

refactor/이슈번호-설명

test/이슈번호-설명

chore/이슈번호-설명

```

브랜치 설명은 영문 kebab-case로 작성합니다.

예시:

```text

feat/12-google-login

fix/24-map-loading

docs/5-readme-update

chore/3-coderabbit-config

```

## 2. 커밋 메시지

```text

<type>: <변경 사항 요약>



<상세 설명>



Refs #이슈번호

```

### Type

- `feat`: 새로운 기능 추가

- `fix`: 버그 수정

- `docs`: 문서 수정

- `style`: 코드 동작 변화 없는 스타일 수정

- `refactor`: 기능 변화 없는 구조 개선

- `test`: 테스트 추가 또는 수정

- `chore`: 패키지, 빌드, 설정, CI 변경

## 3. 이슈 연결

이슈를 참조만 하는 경우:

```text

Refs #12

```

PR 병합과 함께 이슈를 종료하는 경우:

```text

Closes #12

```

하나의 이슈에 여러 커밋이 포함될 경우 각 커밋에는 `Refs`를 사용하고, PR 본문에는 `Closes`를 사용합니다.

## 4. 커밋 예시

```text

feat: 공연 검색 및 선택 기능 추가



공연명과 공연장으로 공연을 검색하고

선택된 공연 정보를 설문에 반영했습니다.



Refs #12

```

```text

fix: AI 루트 생성 제한 오류 처리



AI_ROUTE_LIMIT_EXCEEDED 응답 시

생성 버튼과 잔여 횟수 상태를 갱신했습니다.



Refs #27

```

## 5. PR 제목

PR 제목은 한글로 작성합니다.

예시:

```text

공연 검색 및 선택 기능 추가

AI 루트 생성 제한 오류 처리

프론트엔드 초기 개발 환경 설정

```
