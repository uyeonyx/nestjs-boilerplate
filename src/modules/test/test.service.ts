import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { S3Service } from '../s3/s3.service';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class TestService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private s3: S3Service,
  ) {}

  // Prisma 테스트
  async createItem(data: CreateItemDto) {
    return await this.prisma.item.create({
      data,
    });
  }

  async getItems() {
    return await this.prisma.item.findMany();
  }

  async getItem(id: number) {
    return await this.prisma.item.findUnique({
      where: { id },
    });
  }

  async updateItem(id: number, data: { name: string }) {
    return await this.prisma.item.update({
      where: { id },
      data,
    });
  }

  async deleteItem(id: number) {
    return await this.prisma.item.delete({
      where: { id },
    });
  }

  // Redis 테스트
  async setCache(key: string, value: string) {
    await this.redis.set(key, value, 300); // 5분 TTL
    return { key, value };
  }

  async getCache(key: string) {
    const value = await this.redis.get(key);
    return { key, value };
  }

  async deleteCache(key: string) {
    await this.redis.del(key);
    return { key, deleted: true };
  }

  // S3 테스트
  async uploadFile(filename: string, file: any) {
    await this.s3.uploadFile('test-bucket', filename, file.buffer, file.mimetype);
    return {
      filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      uploaded: true,
    };
  }

  async downloadFile(filename: string) {
    const buffer = await this.s3.downloadFile('test-bucket', filename);
    return { filename, buffer: buffer.toString('base64') };
  }

  async deleteFile(filename: string) {
    await this.s3.deleteFile('test-bucket', filename);
    return { filename, deleted: true };
  }
}
