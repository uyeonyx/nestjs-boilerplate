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
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TestService } from './test.service';
import { CreateItemDto } from './dto/create-item.dto';
import { SetCacheDto } from './dto/set-cache.dto';
import { GenerateJwtDto } from './dto/generate-jwt.dto';
import {
  JwtTokenResponseDto,
  ItemResponseDto,
  ItemsResponseDto,
  CacheValueResponseDto,
  FileUploadResponseDto,
  FileDownloadResponseDto,
  SuccessMessageResponseDto,
  DeleteResponseDto,
} from './dto/test-response.dto';
import { ApiErrors } from '../../common/decorators/api-error-responses.decorator';
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
  @ApiResponse({
    status: 201,
    description: 'JWT 토큰이 성공적으로 생성되었습니다.',
    type: JwtTokenResponseDto,
  })
  @ApiErrors({ 400: '잘못된 요청 데이터' })
  generateJwtToken(@Body() payload: GenerateJwtDto) {
    return this.testService.generateJwtToken(payload);
  }

  // Prisma 테스트
  @Post('items')
  @ApiOperation({
    summary: '아이템 생성 (Prisma)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '아이템이 성공적으로 생성되었습니다.',
    type: ItemResponseDto,
  })
  @ApiErrors({
    400: '잘못된 요청 데이터',
    401: '인증되지 않은 요청',
    403: '권한 부족 (관리자 권한 필요)',
    409: '이미 존재하는 리소스',
  })
  createItem(@Body() data: CreateItemDto) {
    return this.testService.createItem(data);
  }

  @Get('items')
  @ApiOperation({
    summary: '모든 아이템 조회 (Prisma)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '모든 아이템 목록을 성공적으로 조회했습니다.',
    type: ItemsResponseDto,
  })
  @ApiErrors({
    401: '인증되지 않은 요청',
    403: '권한 부족 (관리자 권한 필요)',
  })
  getItems() {
    return this.testService.getItems();
  }

  @Get('items/:id')
  @ApiOperation({
    summary: '아이템 상세 조회 (Prisma)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '아이템 상세 정보를 성공적으로 조회했습니다.',
    type: ItemResponseDto,
  })
  @ApiErrors({
    400: '잘못된 요청 데이터',
    401: '인증되지 않은 요청',
    403: '권한 부족 (관리자 권한 필요)',
    404: '리소스를 찾을 수 없음',
  })
  getItem(@Param('id', ParseIntPipe) id: number) {
    return this.testService.getItem(id);
  }

  @Put('items/:id')
  @ApiOperation({
    summary: '아이템 수정 (Prisma)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '아이템이 성공적으로 수정되었습니다.',
    type: ItemResponseDto,
  })
  @ApiErrors({
    400: '잘못된 요청 데이터',
    401: '인증되지 않은 요청',
    403: '권한 부족 (관리자 권한 필요)',
    404: '리소스를 찾을 수 없음',
  })
  updateItem(@Param('id', ParseIntPipe) id: number, @Body() data: { name: string }) {
    return this.testService.updateItem(id, data);
  }

  @Delete('items/:id')
  @ApiOperation({
    summary: '아이템 삭제 (Prisma)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '아이템이 성공적으로 삭제되었습니다.',
    type: DeleteResponseDto,
  })
  @ApiErrors({
    401: '인증되지 않은 요청',
    403: '권한 부족 (관리자 권한 필요)',
    404: '삭제할 아이템을 찾을 수 없음',
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
  @ApiResponse({
    status: 201,
    description: '캐시가 성공적으로 저장되었습니다.',
    type: SuccessMessageResponseDto,
  })
  @ApiErrors({
    400: '잘못된 요청 데이터',
    401: '인증되지 않은 요청',
    403: '권한 부족 (관리자 권한 필요)',
    409: '이미 존재하는 리소스',
  })
  setCache(@Body() data: SetCacheDto) {
    return this.testService.setCache(data.key, data.value);
  }

  @Get('cache/:key')
  @ApiOperation({
    summary: '캐시 조회 (Redis)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '캐시 값을 성공적으로 조회했습니다. 캐시가 존재하지 않으면 null이 반환됩니다.',
    type: CacheValueResponseDto,
  })
  @ApiErrors({
    401: '인증되지 않은 요청',
    403: '권한 부족 (관리자 권한 필요)',
  })
  getCache(@Param('key') key: string) {
    return this.testService.getCache(key);
  }

  @Delete('cache/:key')
  @ApiOperation({
    summary: '캐시 삭제 (Redis)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '캐시가 성공적으로 삭제되었습니다.',
    type: DeleteResponseDto,
  })
  @ApiErrors({
    401: '인증되지 않은 요청',
    403: '권한 부족 (관리자 권한 필요)',
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
  @ApiResponse({
    status: 201,
    description: '파일이 성공적으로 업로드되었습니다.',
    type: FileUploadResponseDto,
  })
  @ApiErrors({
    400: '잘못된 요청 데이터 또는 파일',
    401: '인증되지 않은 요청',
    403: '권한 부족 (관리자 권한 필요)',
    422: '처리할 수 없는 파일 형식',
  })
  uploadFile(@Param('filename') filename: string, @UploadedFile() file: any) {
    return this.testService.uploadFile(filename, file);
  }

  @Get('files/:filename')
  @ApiOperation({
    summary: '파일 다운로드 (S3)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '파일 다운로드 URL을 성공적으로 생성했습니다.',
    type: FileDownloadResponseDto,
  })
  @ApiErrors({
    400: '잘못된 요청 데이터',
    401: '인증되지 않은 요청',
    403: '권한 부족 (관리자 권한 필요)',
    404: '리소스를 찾을 수 없음',
  })
  downloadFile(@Param('filename') filename: string) {
    return this.testService.downloadFile(filename);
  }

  @Delete('files/:filename')
  @ApiOperation({
    summary: '파일 삭제 (S3)',
    description: '관리자 권한이 필요합니다. JWT 토큰의 roles 배열에 admin이 포함되어야 합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '파일이 성공적으로 삭제되었습니다.',
    type: DeleteResponseDto,
  })
  @ApiErrors({
    400: '잘못된 요청 데이터',
    401: '인증되지 않은 요청',
    403: '권한 부족 (관리자 권한 필요)',
    404: '리소스를 찾을 수 없음',
  })
  deleteFile(@Param('filename') filename: string) {
    return this.testService.deleteFile(filename);
  }
}
