# NestJS Boilerplate

현대적인 백엔드 개발을 위한 NestJS 보일러플레이트입니다. PostgreSQL, Redis, S3(Minio)를 통합한 완전한 개발 환경을 제공합니다.

## 🚀 주요 기능

- **NestJS 11** - 최신 버전의 NestJS 프레임워크
- **TypeScript** - 타입 안전성과 개발 생산성 향상
- **Prisma** - 현대적인 데이터베이스 ORM
- **Redis** - 고성능 캐싱 및 세션 저장소
- **S3 (Minio)** - 파일 저장소 (로컬 개발용 Minio)
- **Zod** - 스키마 유효성 검증
- **Swagger** - 자동 API 문서화
- **Docker Compose** - 개발 환경 컨테이너화
- **JWT 인증** - 토큰 기반 인증 시스템
- **Rate Limiting** - API 호출 제한
- **보안 헤더** - Helmet을 통한 보안 강화
- **로깅** - Pino를 통한 구조화된 로깅

## 📋 요구사항

- Node.js 18+
- pnpm
- Docker & Docker Compose

## 🛠️ 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd nestjs-boilerplate
pnpm install
```

### 2. 개발 환경 설정

```bash
# Docker 서비스 실행 (PostgreSQL, Redis, Minio)
pnpm run docker:dev

# Prisma 클라이언트 생성
pnpm run prisma:generate

# 데이터베이스 스키마 적용
pnpm run prisma:push
```

### 3. 애플리케이션 실행

```bash
# 개발 모드
pnpm run dev

# 프로덕션 빌드
pnpm run build
pnpm run start
```

## 🌐 접속 정보

애플리케이션이 실행되면 다음 URL에서 접속할 수 있습니다:

- **API 서버**: http://localhost:3000
- **Swagger 문서**: http://localhost:3000/docs
- **Minio 웹 콘솔**: http://localhost:9001 (minioadmin/minioadmin)

## 🧪 CRUD 테스트

프로젝트에는 Prisma, Redis, S3의 기본 CRUD 기능을 테스트할 수 있는 API가 포함되어 있습니다.

### Prisma (PostgreSQL) 테스트
- `POST /test/items` - 아이템 생성
- `GET /test/items` - 모든 아이템 조회
- `GET /test/items/:id` - 아이템 상세 조회
- `PUT /test/items/:id` - 아이템 수정
- `DELETE /test/items/:id` - 아이템 삭제

### Redis 캐시 테스트
- `POST /test/cache` - 캐시 저장
- `GET /test/cache/:key` - 캐시 조회
- `DELETE /test/cache/:key` - 캐시 삭제

### S3 파일 저장소 테스트
- `POST /test/files/:filename` - 파일 업로드 (multipart/form-data)
- `GET /test/files/:filename` - 파일 다운로드
- `DELETE /test/files/:filename` - 파일 삭제

모든 테스트 API는 Swagger 문서에서 직접 실행해볼 수 있습니다.

## ⚙️ 환경 변수

프로젝트는 다음 환경 변수를 사용합니다:

### 기본 설정
- `PORT`: 서버 포트 (기본값: 3000)

### 데이터베이스 설정
- `DATABASE_URL`: PostgreSQL 연결 URL
- `DATABASE_HOST`: 데이터베이스 호스트 (기본값: localhost)
- `DATABASE_PORT`: 데이터베이스 포트 (기본값: 5432)

### Redis 설정
- `REDIS_HOST`: Redis 호스트 (기본값: localhost)
- `REDIS_PORT`: Redis 포트 (기본값: 6379)
- `REDIS_PASSWORD`: Redis 비밀번호 (선택사항)
- `REDIS_DB`: Redis 데이터베이스 번호 (기본값: 0)

### S3/Minio 설정
- `S3_ENDPOINT`: S3 엔드포인트 URL (기본값: http://localhost:9000)
- `S3_REGION`: S3 리전 (기본값: us-east-1)
- `S3_ACCESS_KEY_ID`: S3 액세스 키 ID (기본값: minioadmin)
- `S3_SECRET_ACCESS_KEY`: S3 시크릿 액세스 키 (기본값: minioadmin)
- `S3_BUCKET`: 기본 S3 버킷명 (기본값: nestjs-bucket)

### JWT 설정
- `JWT_SECRET`: JWT 서명을 위한 비밀키
- `JWT_EXPIRES_IN`: JWT 만료 시간 (기본값: 1d)

### Rate Limiting 설정
- `THROTTLE_TTL`: 제한 시간 밀리초 (기본값: 60000)
- `THROTTLE_LIMIT`: 제한 시간 내 최대 요청 수 (기본값: 100)

### CORS 설정
- `CORS_ORIGIN`: 허용할 원본 도메인 (쉼표로 구분)
- `CORS_CREDENTIALS`: 자격 증명 포함 여부 (기본값: false)
- `CORS_METHODS`: 허용할 HTTP 메서드
- `CORS_ALLOWED_HEADERS`: 허용할 헤더

### 보안 설정
- `HELMET_ENABLED`: Helmet 보안 헤더 활성화 여부 (기본값: true)

## 📜 사용 가능한 스크립트

```bash
# 개발
pnpm run dev              # 개발 모드로 실행
pnpm run debug            # 디버그 모드로 실행

# 빌드 및 실행
pnpm run build            # 프로덕션 빌드
pnpm run start            # 프로덕션 모드로 실행

# 테스트
pnpm run test             # 단위 테스트
pnpm run test:watch       # 테스트 감시 모드
pnpm run test:cov         # 테스트 커버리지
pnpm run test:e2e         # E2E 테스트

# 코드 품질
pnpm run lint             # ESLint 실행
pnpm run format           # Prettier로 코드 포맷팅

# 데이터베이스
pnpm run prisma:generate  # Prisma 클라이언트 생성
pnpm run prisma:push      # 스키마를 데이터베이스에 적용
pnpm run prisma:migrate   # 마이그레이션 생성 및 실행
pnpm run prisma:studio    # Prisma Studio 실행

# Docker
pnpm run docker:dev       # 개발용 서비스 실행
pnpm run docker:down      # Docker 서비스 중지
```

## 🏗️ 프로젝트 구조

```
src/
├── common/                 # 공통 유틸리티
│   ├── decorators/        # 커스텀 데코레이터
│   ├── filters/           # 예외 필터
│   ├── guards/            # 가드
│   ├── interceptors/      # 인터셉터
│   ├── middleware/        # 미들웨어
│   ├── pipes/             # 파이프
│   └── utils/             # 유틸리티 함수
├── config/                # 설정 파일
├── modules/               # 기능별 모듈
│   ├── app/              # 메인 앱 모듈
│   ├── prisma/           # Prisma 모듈
│   ├── redis/            # Redis 모듈
│   ├── s3/               # S3 모듈
│   └── test/             # CRUD 테스트 모듈
└── main.ts               # 애플리케이션 진입점
```

## 🔧 기술 스택

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **File Storage**: AWS S3 (Minio for development)
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Vitest
- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint, Prettier

## 📝 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.
