import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const GenerateJwtSchema = z.object({
  sub: z.string().describe('사용자 ID'),
  name: z.string().optional().describe('사용자 이름'),
  email: z.string().email().optional().describe('이메일 주소'),
  username: z.string().optional().describe('사용자명'),
  roles: z.array(z.string()).default(['admin']).describe('권한 목록'),
});

export class GenerateJwtDto extends createZodDto(GenerateJwtSchema) {}
