import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateItemSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
});

export class CreateItemDto extends createZodDto(CreateItemSchema) {}
