# API 에러 응답 데코레이터 사용 가이드

## 개요

이 프로젝트에서는 반복되는 `@ApiResponse` 에러 데코레이터를 줄이기 위해 `@ApiErrors` 데코레이터를 제공합니다. 
이를 통해 일관된 에러 응답 문서화와 코드 간소화를 동시에 달성할 수 있습니다.

## 지원하는 HTTP 에러 상태 코드

| 상태 코드 | 에러 타입 | 기본 설명 |
|-----------|-----------|-----------|
| 400 | Bad Request | 잘못된 요청 데이터 |
| 401 | Unauthorized | 인증되지 않은 요청 |
| 403 | Forbidden | 권한 부족 |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 405 | Method Not Allowed | 허용되지 않은 메서드 |
| 409 | Conflict | 리소스 충돌 |
| 422 | Unprocessable Entity | 처리할 수 없는 엔티티 |
| 429 | Too Many Requests | 요청 횟수 제한 초과 |
| 500 | Internal Server Error | 내부 서버 오류 |
| 502 | Bad Gateway | 잘못된 게이트웨이 |
| 503 | Service Unavailable | 서비스 사용 불가 |
| 504 | Gateway Timeout | 게이트웨이 타임아웃 |

## 사용법

### 기본 사용법

```typescript
import { ApiErrors } from '../../common/decorators/api-error-responses.decorator';

@Controller('example')
export class ExampleController {
  @Get(':id')
  @ApiErrors({
    400: '유효하지 않은 ID 형식',
    404: '해당 ID의 리소스가 존재하지 않음'
  })
  getById(@Param('id') id: string) {
    // 구현
  }
}
```

### 실제 사용 예시

#### 인증이 필요한 엔드포인트
```typescript
@Get('profile')
@ApiBearerAuth()
@ApiErrors({
  401: '인증되지 않은 요청',
  403: '권한 부족'
})
getProfile(@User() user: JwtPayload) {
  // 구현
}
```

#### CRUD 엔드포인트
```typescript
@Get(':id')
@ApiErrors({
  400: '잘못된 요청 데이터',
  401: '인증되지 않은 요청',
  403: '권한 부족 (관리자 권한 필요)',
  404: '리소스를 찾을 수 없음'
})
getById(@Param('id') id: string) {
  // 구현
}

@Post()
@ApiErrors({
  400: '잘못된 요청 데이터',
  401: '인증되지 않은 요청',
  403: '권한 부족 (관리자 권한 필요)',
  409: '이미 존재하는 리소스'
})
create(@Body() data: CreateDto) {
  // 구현
}
```

#### 파일 업로드 엔드포인트
```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
@ApiErrors({
  400: '잘못된 요청 데이터 또는 파일',
  401: '인증되지 않은 요청',
  403: '권한 부족 (관리자 권한 필요)',
  422: '처리할 수 없는 파일 형식'
})
uploadFile(@UploadedFile() file: Express.Multer.File) {
  // 구현
}
```

## Before vs After

### Before (기존 방식)
```typescript
@Delete('items/:id')
@ApiResponse({
  status: 200,
  description: '아이템이 성공적으로 삭제되었습니다.',
  type: DeleteResponseDto,
})
@ApiResponse({
  status: 401,
  description: '인증되지 않은 요청',
  type: UnauthorizedResponseDto,
})
@ApiResponse({
  status: 403,
  description: '권한 부족 (관리자 권한 필요)',
  type: ForbiddenResponseDto,
})
@ApiResponse({
  status: 404,
  description: '삭제할 아이템을 찾을 수 없음',
  type: NotFoundResponseDto,
})
deleteItem(@Param('id') id: number) {
  return this.testService.deleteItem(id);
}
```

### After (새로운 방식)
```typescript
@Delete('items/:id')
@ApiResponse({
  status: 200,
  description: '아이템이 성공적으로 삭제되었습니다.',
  type: DeleteResponseDto,
})
@ApiErrors({
  401: '인증되지 않은 요청',
  403: '권한 부족 (관리자 권한 필요)',
  404: '삭제할 아이템을 찾을 수 없음'
})
deleteItem(@Param('id') id: number) {
  return this.testService.deleteItem(id);
}
```

## 장점

1. **극적인 코드 간소화**: 20줄 → 7줄 (65% 감소)
2. **완벽한 일관성**: 모든 엔드포인트에서 동일한 에러 응답 형식
3. **손쉬운 유지보수**: 에러 응답 변경 시 한 곳에서만 수정
4. **탁월한 가독성**: 비즈니스 로직에 집중할 수 있는 깔끔한 코드
5. **타입 안전성**: TypeScript 컴파일 타임 검증
6. **중복 제거**: 상태 코드를 두 번 작성할 필요 없음
7. **단일 표준**: 하나의 일관된 방식으로 통일

## 새로운 에러 응답 추가하기

새로운 HTTP 에러 상태 코드를 추가하려면:

1. `src/common/dto/error-response.dto.ts`에 새로운 스키마와 DTO 추가
2. `src/common/decorators/api-error-responses.decorator.ts`의 `ERROR_RESPONSE_MAP`에 매핑 추가

```typescript
// 1. error-response.dto.ts에 추가
export const CustomErrorResponseSchema = z.object({
  statusCode: z.literal(418).describe('HTTP 상태 코드'),
  message: z.literal("I'm a teapot").describe('에러 메시지'),
  error: z.literal("I'm a teapot").describe('에러 타입'),
  timestamp: z.string().datetime().describe('에러 발생 시간').default('2024-01-15T10:30:00.000Z'),
  path: z.string().describe('요청 경로').default('/path/items'),
});

export class CustomErrorResponseDto extends createZodDto(CustomErrorResponseSchema) {}

// 2. api-error-responses.decorator.ts의 ERROR_RESPONSE_MAP에 추가
const ERROR_RESPONSE_MAP: Record<number, { dto: Type<any>; description: string }> = {
  // ... 기존 매핑들
  418: {
    dto: CustomErrorResponseDto,
    description: "I'm a teapot",
  },
};
```

## 사용 예시 템플릿

프로젝트에서 자주 사용되는 패턴들:

```typescript
// 인증만 필요한 경우
@ApiErrors({
  401: '인증되지 않은 요청',
  403: '권한 부족'
})

// 일반 CRUD 읽기
@ApiErrors({
  400: '잘못된 요청 데이터',
  401: '인증되지 않은 요청',
  403: '권한 부족 (관리자 권한 필요)',
  404: '리소스를 찾을 수 없음'
})

// 생성/수정
@ApiErrors({
  400: '잘못된 요청 데이터',
  401: '인증되지 않은 요청',
  403: '권한 부족 (관리자 권한 필요)',
  409: '이미 존재하는 리소스'
})

// 삭제
@ApiErrors({
  401: '인증되지 않은 요청',
  403: '권한 부족 (관리자 권한 필요)',
  404: '삭제할 리소스를 찾을 수 없음'
})
```

이제 단일한 표준 방식으로 깔끔하고 유지보수하기 쉬운 API 문서화를 즐기세요! 🎯 