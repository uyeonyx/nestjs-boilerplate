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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { TestService } from './test.service';
import { CreateItemDto } from './dto/create-item.dto';
import { SetCacheDto } from './dto/set-cache.dto';
import { GenerateJwtDto } from './dto/generate-jwt.dto';
import { RoleGuard } from '../../common/guards/role.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('CRUD 테스트')
@UseGuards(RoleGuard)
@Roles('admin')
@ApiBearerAuth()
@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  // JWT 토큰 생성 (테스트용)
  @Post('generate-jwt')
  @Public()
  @ApiOperation({
    summary: 'JWT 토큰 생성 (테스트용)',
    description: '테스트를 위한 JWT 토큰을 생성합니다. 원하는 페이로드를 입력하여 토큰을 발급받을 수 있습니다.',
  })
  generateJwtToken(@Body() payload: GenerateJwtDto) {
    return this.testService.generateJwtToken(payload);
  }

  // Prisma 테스트
  @Post('items')
  @ApiOperation({
    summary: '아이템 생성 (Prisma)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  createItem(@Body() data: CreateItemDto) {
    return this.testService.createItem(data);
  }

  @Get('items')
  @ApiOperation({
    summary: '모든 아이템 조회 (Prisma)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  getItems() {
    return this.testService.getItems();
  }

  @Get('items/:id')
  @ApiOperation({
    summary: '아이템 상세 조회 (Prisma)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  getItem(@Param('id', ParseIntPipe) id: number) {
    return this.testService.getItem(id);
  }

  @Put('items/:id')
  @ApiOperation({
    summary: '아이템 수정 (Prisma)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  updateItem(@Param('id', ParseIntPipe) id: number, @Body() data: { name: string }) {
    return this.testService.updateItem(id, data);
  }

  @Delete('items/:id')
  @ApiOperation({
    summary: '아이템 삭제 (Prisma)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  deleteItem(@Param('id', ParseIntPipe) id: number) {
    return this.testService.deleteItem(id);
  }

  // Redis 테스트
  @Post('cache')
  @ApiOperation({
    summary: '캐시 저장 (Redis)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  setCache(@Body() data: SetCacheDto) {
    return this.testService.setCache(data.key, data.value);
  }

  @Get('cache/:key')
  @ApiOperation({
    summary: '캐시 조회 (Redis)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  getCache(@Param('key') key: string) {
    return this.testService.getCache(key);
  }

  @Delete('cache/:key')
  @ApiOperation({
    summary: '캐시 삭제 (Redis)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  deleteCache(@Param('key') key: string) {
    return this.testService.deleteCache(key);
  }

  // S3 테스트
  @Post('files/:filename')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '파일 업로드 (S3)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
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
  @ApiOperation({
    summary: '파일 다운로드 (S3)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  downloadFile(@Param('filename') filename: string) {
    return this.testService.downloadFile(filename);
  }

  @Delete('files/:filename')
  @ApiOperation({
    summary: '파일 삭제 (S3)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  deleteFile(@Param('filename') filename: string) {
    return this.testService.deleteFile(filename);
  }
}
