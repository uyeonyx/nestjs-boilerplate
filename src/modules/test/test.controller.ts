import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { TestService } from './test.service';
import { CreateItemDto } from './dto/create-item.dto';
import { SetCacheDto } from './dto/set-cache.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('CRUD 테스트')
@Controller('test')
@Public()
export class TestController {
  constructor(private testService: TestService) {}

  // Prisma 테스트
  @Post('items')
  @ApiOperation({ summary: '아이템 생성 (Prisma)' })
  createItem(@Body() data: CreateItemDto) {
    return this.testService.createItem(data);
  }

  @Get('items')
  @ApiOperation({ summary: '모든 아이템 조회 (Prisma)' })
  getItems() {
    return this.testService.getItems();
  }

  @Get('items/:id')
  @ApiOperation({ summary: '아이템 상세 조회 (Prisma)' })
  getItem(@Param('id', ParseIntPipe) id: number) {
    return this.testService.getItem(id);
  }

  @Put('items/:id')
  @ApiOperation({ summary: '아이템 수정 (Prisma)' })
  updateItem(@Param('id', ParseIntPipe) id: number, @Body() data: { name: string }) {
    return this.testService.updateItem(id, data);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: '아이템 삭제 (Prisma)' })
  deleteItem(@Param('id', ParseIntPipe) id: number) {
    return this.testService.deleteItem(id);
  }

  // Redis 테스트
  @Post('cache')
  @ApiOperation({ summary: '캐시 저장 (Redis)' })
  setCache(@Body() data: SetCacheDto) {
    return this.testService.setCache(data.key, data.value);
  }

  @Get('cache/:key')
  @ApiOperation({ summary: '캐시 조회 (Redis)' })
  getCache(@Param('key') key: string) {
    return this.testService.getCache(key);
  }

  @Delete('cache/:key')
  @ApiOperation({ summary: '캐시 삭제 (Redis)' })
  deleteCache(@Param('key') key: string) {
    return this.testService.deleteCache(key);
  }

  // S3 테스트
  @Post('files/:filename')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '파일 업로드 (S3)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(@Param('filename') filename: string, @UploadedFile() file: any) {
    return this.testService.uploadFile(filename, file);
  }

  @Get('files/:filename')
  @ApiOperation({ summary: '파일 다운로드 (S3)' })
  downloadFile(@Param('filename') filename: string) {
    return this.testService.downloadFile(filename);
  }

  @Delete('files/:filename')
  @ApiOperation({ summary: '파일 삭제 (S3)' })
  deleteFile(@Param('filename') filename: string) {
    return this.testService.deleteFile(filename);
  }
}
