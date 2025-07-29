import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SetCacheSchema = z.object({
  key: z.string().min(1, '키를 입력해주세요'),
  value: z.string().min(1, '값을 입력해주세요'),
});

export class SetCacheDto extends createZodDto(SetCacheSchema) {}
