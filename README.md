# 링크나무

내 모든 링크를 한 페이지에 모아 두고, 하나의 URL로 공유하는 서비스입니다.

## 기술 스택

- Next.js 16 (App Router) · TypeScript
- Tailwind CSS v4
- MongoDB Atlas (클릭 수 저장)
- Vercel 배포

## 기능

- 프로필 표시 (이름, 한 줄 소개, 프로필 사진)
- 링크 카드 목록 (클릭 가능)
- 링크별 클릭 수 집계 — `/r/[id]` 리다이렉트 시 +1

## 실행

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속.

`MONGODB_URI`가 비어 있으면 샘플 데이터로 동작하며, 저장 기능은 비활성화됩니다.

## 환경 변수 (`.env.local`)

| 변수 | 설명 |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas 연결 문자열. 비우면 샘플 데이터로 동작 |
| `MONGODB_DB` | 데이터베이스 이름 (기본값 `linknamu`) |

## 구조

```
src/
├── app/
│   ├── page.tsx           # 공개 프로필 페이지
│   └── r/[id]/route.ts    # 클릭 집계 + 리다이렉트
├── components/            # ProfileHeader, LinkCard, LinkList
└── lib/                   # mongodb 연결, 데이터 액세스
```

## 데이터 모델 (MongoDB)

- `profile` — 단일 문서 (`_id: "profile"`): `name`, `bio`, `avatarUrl`
- `links` — `title`, `url`, `clicks`, `order`, `createdAt`
