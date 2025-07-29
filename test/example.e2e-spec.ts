import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from '../src/app/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { RedisService } from '../src/modules/redis/redis.service';
import { S3Service } from '../src/modules/s3/s3.service';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('ExampleController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let redisService: RedisService;
  let s3Service: S3Service;
  let authToken: string;

  // 테스트용 데이터
  const testBucket = 'example-bucket';
  const testItemData = { name: '테스트 아이템' };
  const testCacheData = { key: 'test-key-e2e', value: 'test-value-e2e' };
  const testFilename = 'test-file-e2e.txt';
  const testFileContent = Buffer.from('E2E 테스트 파일 내용');

  let createdItemId: number | undefined;
  const createdCacheKeys: string[] = [];
  const uploadedFiles: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // 전역 설정 적용 (main.ts와 동일하게)
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
    app.useGlobalPipes(new ZodValidationPipe());

    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    redisService = moduleFixture.get<RedisService>(RedisService);
    s3Service = moduleFixture.get<S3Service>(S3Service);

    // JWT 토큰 생성
    const jwtResponse = await request(app.getHttpServer())
      .post('/example/generate-jwt')
      .send({ sub: '1', email: 'test@example.com', roles: ['admin'] })
      .expect(201);

    authToken = jwtResponse.body.data.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // 각 테스트 전에 초기화
  });

  afterEach(async () => {
    // 각 테스트 후 클린업
    await cleanupTestData();
  });

  async function cleanupTestData() {
    try {
      // Prisma 클린업: 생성된 아이템 삭제
      if (createdItemId) {
        await prismaService.item.delete({ where: { id: createdItemId } }).catch(() => {});
        createdItemId = undefined;
      }

      // Redis 클린업: 생성된 캐시 키들 삭제
      for (const key of createdCacheKeys) {
        await redisService.del(key).catch(() => {});
      }
      createdCacheKeys.length = 0;

      // S3 클린업: 업로드된 파일들 삭제
      for (const filename of uploadedFiles) {
        await s3Service.deleteFile(testBucket, filename).catch(() => {});
      }
      uploadedFiles.length = 0;
    } catch (error) {
      console.warn('클린업 중 에러 발생:', error);
    }
  }

  describe('JWT 토큰 생성', () => {
    it('/example/generate-jwt (POST)', async () => {
      const payload = { sub: '2', email: 'test2@example.com', roles: ['user'] };

      const response = await request(app.getHttpServer()).post('/example/generate-jwt').send(payload).expect(201);

      expect(response.body.data).toHaveProperty('access_token');
      expect(typeof response.body.data.access_token).toBe('string');
      expect(response.body.statusCode).toBe(201);
    });
  });

  describe('Prisma 아이템 CRUD', () => {
    it('/example/items (POST) - 아이템 생성', async () => {
      const response = await request(app.getHttpServer())
        .post('/example/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testItemData)
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(testItemData.name);
      expect(response.body.statusCode).toBe(201);

      createdItemId = response.body.data.id;
    });

    it('/example/items (GET) - 모든 아이템 조회', async () => {
      // 먼저 아이템 생성
      const createResponse = await request(app.getHttpServer())
        .post('/example/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testItemData)
        .expect(201);

      createdItemId = createResponse.body.data.id;

      const response = await request(app.getHttpServer())
        .get('/example/items')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.statusCode).toBe(200);
    });

    it('/example/items/:id (GET) - 아이템 상세 조회', async () => {
      // 먼저 아이템 생성
      const createResponse = await request(app.getHttpServer())
        .post('/example/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testItemData)
        .expect(201);

      createdItemId = createResponse.body.data.id;

      const response = await request(app.getHttpServer())
        .get(`/example/items/${createdItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(createdItemId);
      expect(response.body.data.name).toBe(testItemData.name);
      expect(response.body.statusCode).toBe(200);
    });

    it('/example/items/:id (PUT) - 아이템 수정', async () => {
      // 먼저 아이템 생성
      const createResponse = await request(app.getHttpServer())
        .post('/example/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testItemData)
        .expect(201);

      createdItemId = createResponse.body.data.id;

      const updateData = { name: '수정된 아이템' };
      const response = await request(app.getHttpServer())
        .put(`/example/items/${createdItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.id).toBe(createdItemId);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.statusCode).toBe(200);
    });

    it('/example/items/:id (DELETE) - 아이템 삭제', async () => {
      // 먼저 아이템 생성
      const createResponse = await request(app.getHttpServer())
        .post('/example/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testItemData)
        .expect(201);

      const itemId = createResponse.body.data.id;

      const response = await request(app.getHttpServer())
        .delete(`/example/items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeNull();
      expect(response.body.statusCode).toBe(200);

      // 삭제 확인
      await request(app.getHttpServer())
        .get(`/example/items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500); // Item not found 에러
    });
  });

  describe('Redis 캐시 CRUD', () => {
    it('/example/cache (POST) - 캐시 저장', async () => {
      const response = await request(app.getHttpServer())
        .post('/example/cache')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testCacheData)
        .expect(201);

      expect(response.body.data).toBe('Cache set successfully');
      expect(response.body.statusCode).toBe(201);

      createdCacheKeys.push(testCacheData.key);
    });

    it('/example/cache/:key (GET) - 캐시 조회', async () => {
      // 먼저 캐시 저장
      await request(app.getHttpServer())
        .post('/example/cache')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testCacheData)
        .expect(201);

      createdCacheKeys.push(testCacheData.key);

      const response = await request(app.getHttpServer())
        .get(`/example/cache/${testCacheData.key}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBe(testCacheData.value);
      expect(response.body.statusCode).toBe(200);
    });

    it('/example/cache/:key (DELETE) - 캐시 삭제', async () => {
      // 먼저 캐시 저장
      await request(app.getHttpServer())
        .post('/example/cache')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testCacheData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .delete(`/example/cache/${testCacheData.key}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeNull();
      expect(response.body.statusCode).toBe(200);

      // 삭제 확인
      const getResponse = await request(app.getHttpServer())
        .get(`/example/cache/${testCacheData.key}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.data).toBeNull();
    });
  });

  describe('S3 파일 CRUD', () => {
    it('/example/files/:filename (POST) - 파일 업로드', async () => {
      const response = await request(app.getHttpServer())
        .post(`/example/files/${testFilename}`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testFileContent, testFilename)
        .expect(201);

      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data).toHaveProperty('key');
      expect(response.body.data.filename).toBe(testFilename);
      expect(response.body.statusCode).toBe(201);

      uploadedFiles.push(testFilename);
    });

    it('/example/files/:filename (GET) - 파일 다운로드 URL 생성', async () => {
      // 먼저 파일 업로드
      await request(app.getHttpServer())
        .post(`/example/files/${testFilename}`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testFileContent, testFilename)
        .expect(201);

      uploadedFiles.push(testFilename);

      const response = await request(app.getHttpServer())
        .get(`/example/files/${testFilename}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data.filename).toBe(testFilename);
      expect(response.body.statusCode).toBe(200);
      expect(typeof response.body.data.url).toBe('string');
    });

    it('/example/files/:filename (DELETE) - 파일 삭제', async () => {
      // 먼저 파일 업로드
      await request(app.getHttpServer())
        .post(`/example/files/${testFilename}`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testFileContent, testFilename)
        .expect(201);

      const response = await request(app.getHttpServer())
        .delete(`/example/files/${testFilename}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeNull();
      expect(response.body.statusCode).toBe(200);
    });
  });

  describe('인증 테스트', () => {
    it('인증 토큰 없이 접근 시 401 에러', async () => {
      await request(app.getHttpServer()).post('/example/items').send(testItemData).expect(401);
    });

    it('잘못된 토큰으로 접근 시 401 에러', async () => {
      await request(app.getHttpServer())
        .post('/example/items')
        .set('Authorization', 'Bearer invalid-token')
        .send(testItemData)
        .expect(401);
    });
  });
});
