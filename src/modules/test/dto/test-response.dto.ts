import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CommonResponseSchema } from '../../../common/dto/common-response.dto';

// JWT 토큰 응답 스키마
export const JwtTokenSchema = z.object({
  access_token: z.string().describe('JWT 액세스 토큰').default('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
});

export const JwtTokenResponseSchema = CommonResponseSchema(JwtTokenSchema);
export class JwtTokenResponseDto extends createZodDto(JwtTokenResponseSchema) {}

// 아이템 스키마
export const ItemSchema = z.object({
  id: z.number().int().describe('아이템 ID').default(1),
  name: z.string().describe('아이템 이름').default('샘플 아이템'),
  createdAt: z.string().datetime().describe('생성 시간').default('2024-01-15T10:30:00.000Z'),
  updatedAt: z.string().datetime().describe('수정 시간').default('2024-01-15T10:30:00.000Z'),
});

export const ItemResponseSchema = CommonResponseSchema(ItemSchema);
export class ItemResponseDto extends createZodDto(ItemResponseSchema) {}

export const ItemsResponseSchema = CommonResponseSchema(z.array(ItemSchema));
export class ItemsResponseDto extends createZodDto(ItemsResponseSchema) {}

// 캐시 값 응답 스키마
export const CacheValueResponseSchema = CommonResponseSchema(z.string().nullable().default('cached_value'));
export class CacheValueResponseDto extends createZodDto(CacheValueResponseSchema) {}

// 파일 업로드 응답 스키마
export const FileUploadSchema = z.object({
  url: z.string().url().describe('업로드된 파일 URL').default('https://s3.amazonaws.com/bucket/file.jpg'),
  key: z.string().describe('S3 파일 키').default('uploads/file.jpg'),
  filename: z.string().describe('파일명').default('file.jpg'),
});

export const FileUploadResponseSchema = CommonResponseSchema(FileUploadSchema);
export class FileUploadResponseDto extends createZodDto(FileUploadResponseSchema) {}

// 파일 다운로드 응답 스키마
export const FileDownloadSchema = z.object({
  url: z.string().url().describe('다운로드 URL').default('https://s3.amazonaws.com/bucket/file.jpg?signed=...'),
  filename: z.string().describe('파일명').default('file.jpg'),
});

export const FileDownloadResponseSchema = CommonResponseSchema(FileDownloadSchema);
export class FileDownloadResponseDto extends createZodDto(FileDownloadResponseSchema) {}

// 성공 메시지 응답 스키마
export const SuccessMessageResponseSchema = CommonResponseSchema(
  z.string().default('작업이 성공적으로 완료되었습니다.'),
);
export class SuccessMessageResponseDto extends createZodDto(SuccessMessageResponseSchema) {}

// 삭제 응답 스키마
export const DeleteResponseSchema = CommonResponseSchema(z.null());
export class DeleteResponseDto extends createZodDto(DeleteResponseSchema) {}
