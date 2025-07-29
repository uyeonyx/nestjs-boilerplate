import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class ExampleService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private redis: RedisService,
    private s3: S3Service,
  ) {}

  async generateJwtToken(payload: any) {
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  async createItem(data: { name: string }) {
    const item = await this.prisma.item.create({
      data,
    });
    return item;
  }

  async getItems() {
    const items = await this.prisma.item.findMany();
    return items;
  }

  async getItem(id: number) {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }

  async updateItem(id: number, data: { name: string }) {
    const item = await this.prisma.item.update({
      where: { id },
      data,
    });
    return item;
  }

  async deleteItem(id: number) {
    await this.prisma.item.delete({
      where: { id },
    });
    return null;
  }

  async setCache(key: string, value: string) {
    await this.redis.set(key, value);
    return 'Cache set successfully';
  }

  async getCache(key: string) {
    const value = await this.redis.get(key);
    return value;
  }

  async deleteCache(key: string) {
    await this.redis.del(key);
    return null;
  }

  async uploadFile(filename: string, file: any) {
    await this.s3.uploadFile('example-bucket', filename, file.buffer, file.mimetype);
    return {
      url: `http://localhost:9000/example-bucket/${filename}`,
      key: filename,
      filename,
    };
  }

  async downloadFile(filename: string) {
    const url = await this.s3.getSignedDownloadUrl('example-bucket', filename);
    return {
      url,
      filename,
    };
  }

  async deleteFile(filename: string) {
    await this.s3.deleteFile('example-bucket', filename);
    return null;
  }
}
