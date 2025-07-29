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

  generateJwtToken(payload: any) {
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
    const bucketName = 'example-bucket';

    // uploadFile 내부에서 이미 버킷 생성을 처리하므로 별도 처리 불필요
    await this.s3.uploadFile(bucketName, filename, file.buffer, file.mimetype);
    return {
      url: `http://localhost:9000/${bucketName}/${filename}`,
      key: filename,
      filename,
    };
  }

  async downloadFile(filename: string) {
    const bucketName = 'example-bucket';

    // 다운로드 전 버킷 존재 보장
    await this.s3.createBucketIfNotExists(bucketName);

    const url = await this.s3.getSignedDownloadUrl(bucketName, filename);
    return {
      url,
      filename,
    };
  }

  async deleteFile(filename: string) {
    const bucketName = 'example-bucket';

    // 삭제 전 버킷 존재 보장 (버킷이 없으면 삭제할 것도 없지만 일관성을 위해)
    await this.s3.createBucketIfNotExists(bucketName);

    await this.s3.deleteFile(bucketName, filename);
    return null;
  }
}
