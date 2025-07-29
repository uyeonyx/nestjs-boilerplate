import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExampleService } from './example.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { S3Service } from '../s3/s3.service';

describe('ExampleService', () => {
  let service: ExampleService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let redisService: RedisService;
  let s3Service: S3Service;

  const mockItem = {
    id: 1,
    name: '테스트 아이템',
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
  };

  beforeEach(async () => {
    const mockJwtService = {
      sign: vi.fn(),
    };

    const mockPrismaService = {
      item: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const mockRedisService = {
      set: vi.fn(),
      get: vi.fn(),
      del: vi.fn(),
    };

    const mockS3Service = {
      uploadFile: vi.fn(),
      getSignedDownloadUrl: vi.fn(),
      deleteFile: vi.fn(),
      createBucketIfNotExists: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExampleService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: S3Service, useValue: mockS3Service },
      ],
    }).compile();

    service = module.get<ExampleService>(ExampleService);
    jwtService = module.get(JwtService);
    prismaService = module.get(PrismaService);
    redisService = module.get(RedisService);
    s3Service = module.get(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateJwtToken', () => {
    it('JWT 토큰을 생성해야 함', () => {
      const payload = { sub: '1', email: 'test@example.com' };
      const token = 'test-jwt-token';

      vi.mocked(jwtService.sign).mockReturnValue(token);

      const result = service.generateJwtToken(payload);

      expect(jwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ access_token: token });
    });
  });

  describe('createItem', () => {
    it('아이템을 생성해야 함', async () => {
      const createData = { name: '새 아이템' };
      const createdItem = { ...mockItem, ...createData };

      vi.mocked(prismaService.item.create).mockResolvedValue(createdItem);

      const result = await service.createItem(createData);

      expect(prismaService.item.create).toHaveBeenCalledWith({ data: createData });
      expect(result).toEqual(createdItem);
    });
  });

  describe('getItems', () => {
    it('모든 아이템을 조회해야 함', async () => {
      const items = [mockItem];

      vi.mocked(prismaService.item.findMany).mockResolvedValue(items);

      const result = await service.getItems();

      expect(prismaService.item.findMany).toHaveBeenCalled();
      expect(result).toEqual(items);
    });
  });

  describe('getItem', () => {
    it('아이템을 조회해야 함', async () => {
      const itemId = 1;

      vi.mocked(prismaService.item.findUnique).mockResolvedValue(mockItem);

      const result = await service.getItem(itemId);

      expect(prismaService.item.findUnique).toHaveBeenCalledWith({ where: { id: itemId } });
      expect(result).toEqual(mockItem);
    });

    it('아이템이 없으면 에러를 던져야 함', async () => {
      const itemId = 999;

      vi.mocked(prismaService.item.findUnique).mockResolvedValue(null);

      await expect(service.getItem(itemId)).rejects.toThrow('Item not found');
    });
  });

  describe('updateItem', () => {
    it('아이템을 수정해야 함', async () => {
      const itemId = 1;
      const updateData = { name: '수정된 아이템' };
      const updatedItem = { ...mockItem, ...updateData };

      vi.mocked(prismaService.item.update).mockResolvedValue(updatedItem);

      const result = await service.updateItem(itemId, updateData);

      expect(prismaService.item.update).toHaveBeenCalledWith({
        where: { id: itemId },
        data: updateData,
      });
      expect(result).toEqual(updatedItem);
    });
  });

  describe('deleteItem', () => {
    it('아이템을 삭제해야 함', async () => {
      const itemId = 1;

      vi.mocked(prismaService.item.delete).mockResolvedValue(mockItem);

      const result = await service.deleteItem(itemId);

      expect(prismaService.item.delete).toHaveBeenCalledWith({ where: { id: itemId } });
      expect(result).toBeNull();
    });
  });

  describe('setCache', () => {
    it('캐시를 저장해야 함', async () => {
      const key = 'test-key';
      const value = 'test-value';

      vi.mocked(redisService.set).mockResolvedValue('OK');

      const result = await service.setCache(key, value);

      expect(redisService.set).toHaveBeenCalledWith(key, value);
      expect(result).toBe('Cache set successfully');
    });
  });

  describe('getCache', () => {
    it('캐시를 조회해야 함', async () => {
      const key = 'test-key';
      const value = 'test-value';

      vi.mocked(redisService.get).mockResolvedValue(value);

      const result = await service.getCache(key);

      expect(redisService.get).toHaveBeenCalledWith(key);
      expect(result).toBe(value);
    });

    it('캐시가 없으면 null을 반환해야 함', async () => {
      const key = 'nonexistent-key';

      vi.mocked(redisService.get).mockResolvedValue(null);

      const result = await service.getCache(key);

      expect(redisService.get).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });
  });

  describe('deleteCache', () => {
    it('캐시를 삭제해야 함', async () => {
      const key = 'test-key';

      vi.mocked(redisService.del).mockResolvedValue(1);

      const result = await service.deleteCache(key);

      expect(redisService.del).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });
  });

  describe('uploadFile', () => {
    it('파일을 업로드해야 함', async () => {
      const filename = 'test-file.txt';
      const file = {
        buffer: Buffer.from('test content'),
        mimetype: 'text/plain',
      };

      vi.mocked(s3Service.uploadFile).mockResolvedValue(undefined);

      const result = await service.uploadFile(filename, file);

      expect(s3Service.uploadFile).toHaveBeenCalledWith('example-bucket', filename, file.buffer, file.mimetype);
      expect(result).toEqual({
        url: `http://localhost:9000/example-bucket/${filename}`,
        key: filename,
        filename,
      });
    });
  });

  describe('downloadFile', () => {
    it('파일 다운로드 URL을 생성해야 함', async () => {
      const filename = 'test-file.txt';
      const signedUrl = 'https://signed-url.com/test-file.txt';

      vi.mocked(s3Service.createBucketIfNotExists).mockResolvedValue(undefined);
      vi.mocked(s3Service.getSignedDownloadUrl).mockResolvedValue(signedUrl);

      const result = await service.downloadFile(filename);

      expect(s3Service.createBucketIfNotExists).toHaveBeenCalledWith('example-bucket');
      expect(s3Service.getSignedDownloadUrl).toHaveBeenCalledWith('example-bucket', filename);
      expect(result).toEqual({
        url: signedUrl,
        filename,
      });
    });
  });

  describe('deleteFile', () => {
    it('파일을 삭제해야 함', async () => {
      const filename = 'test-file.txt';

      vi.mocked(s3Service.createBucketIfNotExists).mockResolvedValue(undefined);
      vi.mocked(s3Service.deleteFile).mockResolvedValue(undefined);

      const result = await service.deleteFile(filename);

      expect(s3Service.createBucketIfNotExists).toHaveBeenCalledWith('example-bucket');
      expect(s3Service.deleteFile).toHaveBeenCalledWith('example-bucket', filename);
      expect(result).toBeNull();
    });
  });
});
