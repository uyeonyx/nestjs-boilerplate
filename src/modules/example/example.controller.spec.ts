import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

describe('ExampleController', () => {
  let controller: ExampleController;
  let service: ExampleService;

  const mockItem = {
    id: 1,
    name: '테스트 아이템',
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
  };

  beforeEach(async () => {
    const mockExampleService = {
      generateJwtToken: vi.fn(),
      createItem: vi.fn(),
      getItems: vi.fn(),
      getItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
      setCache: vi.fn(),
      getCache: vi.fn(),
      deleteCache: vi.fn(),
      uploadFile: vi.fn(),
      downloadFile: vi.fn(),
      deleteFile: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExampleController],
      providers: [{ provide: ExampleService, useValue: mockExampleService }],
    }).compile();

    controller = module.get<ExampleController>(ExampleController);
    service = module.get<ExampleService>(ExampleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateJwtToken', () => {
    it('JWT 토큰을 생성해야 함', () => {
      const payload = { sub: '1', email: 'test@example.com', roles: ['admin'] };
      const token = { access_token: 'test-jwt-token' };

      vi.mocked(service.generateJwtToken).mockReturnValue(token);

      const result = controller.generateJwtToken(payload);

      expect(service.generateJwtToken).toHaveBeenCalledWith(payload);
      expect(result).toEqual(token);
    });
  });

  describe('createItem', () => {
    it('아이템을 생성해야 함', async () => {
      const createData = { name: '새 아이템' };
      const createdItem = { ...mockItem, ...createData };

      vi.mocked(service.createItem).mockResolvedValue(createdItem);

      const result = await controller.createItem(createData);

      expect(service.createItem).toHaveBeenCalledWith(createData);
      expect(result).toEqual(createdItem);
    });
  });

  describe('getItems', () => {
    it('모든 아이템을 조회해야 함', async () => {
      const items = [mockItem];

      vi.mocked(service.getItems).mockResolvedValue(items);

      const result = await controller.getItems();

      expect(service.getItems).toHaveBeenCalled();
      expect(result).toEqual(items);
    });
  });

  describe('getItem', () => {
    it('아이템을 조회해야 함', async () => {
      const itemId = 1;

      vi.mocked(service.getItem).mockResolvedValue(mockItem);

      const result = await controller.getItem(itemId);

      expect(service.getItem).toHaveBeenCalledWith(itemId);
      expect(result).toEqual(mockItem);
    });
  });

  describe('updateItem', () => {
    it('아이템을 수정해야 함', async () => {
      const itemId = 1;
      const updateData = { name: '수정된 아이템' };
      const updatedItem = { ...mockItem, ...updateData };

      vi.mocked(service.updateItem).mockResolvedValue(updatedItem);

      const result = await controller.updateItem(itemId, updateData);

      expect(service.updateItem).toHaveBeenCalledWith(itemId, updateData);
      expect(result).toEqual(updatedItem);
    });
  });

  describe('deleteItem', () => {
    it('아이템을 삭제해야 함', async () => {
      const itemId = 1;

      vi.mocked(service.deleteItem).mockResolvedValue(null);

      const result = await controller.deleteItem(itemId);

      expect(service.deleteItem).toHaveBeenCalledWith(itemId);
      expect(result).toBeNull();
    });
  });

  describe('setCache', () => {
    it('캐시를 저장해야 함', async () => {
      const cacheData = { key: 'test-key', value: 'test-value' };
      const message = 'Cache set successfully';

      vi.mocked(service.setCache).mockResolvedValue(message);

      const result = await controller.setCache(cacheData);

      expect(service.setCache).toHaveBeenCalledWith(cacheData.key, cacheData.value);
      expect(result).toBe(message);
    });
  });

  describe('getCache', () => {
    it('캐시를 조회해야 함', async () => {
      const key = 'test-key';
      const value = 'test-value';

      vi.mocked(service.getCache).mockResolvedValue(value);

      const result = await controller.getCache(key);

      expect(service.getCache).toHaveBeenCalledWith(key);
      expect(result).toBe(value);
    });
  });

  describe('deleteCache', () => {
    it('캐시를 삭제해야 함', async () => {
      const key = 'test-key';

      vi.mocked(service.deleteCache).mockResolvedValue(null);

      const result = await controller.deleteCache(key);

      expect(service.deleteCache).toHaveBeenCalledWith(key);
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
      const uploadResult = {
        url: `http://localhost:9000/example-bucket/${filename}`,
        key: filename,
        filename,
      };

      vi.mocked(service.uploadFile).mockResolvedValue(uploadResult);

      const result = await controller.uploadFile(filename, file);

      expect(service.uploadFile).toHaveBeenCalledWith(filename, file);
      expect(result).toEqual(uploadResult);
    });
  });

  describe('downloadFile', () => {
    it('파일 다운로드 URL을 생성해야 함', async () => {
      const filename = 'test-file.txt';
      const downloadResult = {
        url: 'https://signed-url.com/test-file.txt',
        filename,
      };

      vi.mocked(service.downloadFile).mockResolvedValue(downloadResult);

      const result = await controller.downloadFile(filename);

      expect(service.downloadFile).toHaveBeenCalledWith(filename);
      expect(result).toEqual(downloadResult);
    });
  });

  describe('deleteFile', () => {
    it('파일을 삭제해야 함', async () => {
      const filename = 'test-file.txt';

      vi.mocked(service.deleteFile).mockResolvedValue(null);

      const result = await controller.deleteFile(filename);

      expect(service.deleteFile).toHaveBeenCalledWith(filename);
      expect(result).toBeNull();
    });
  });
});
