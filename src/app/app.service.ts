import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';
import * as process from 'process';
import { HealthCheckDto } from './dto/health-check.dto';
import { PackageUtil } from '../common/utils/package.util';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHealthCheck(): HealthCheckDto {
    const now = new Date();
    const uptime = process.uptime();

    return {
      status: 'ok',
      timestamp: now.toISOString(),
      uptime: {
        seconds: Math.floor(uptime),
        formatted: this.formatUptime(uptime),
      },
      environment: process.env.NODE_ENV || 'development',
      version: PackageUtil.getVersion(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
        unit: 'MB',
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        cpus: os.cpus().length,
        loadAverage: os.loadavg(),
        freeMemory: Math.round(os.freemem() / 1024 / 1024),
        totalMemory: Math.round(os.totalmem() / 1024 / 1024),
        memoryUnit: 'MB',
      },
      config: {
        port: this.configService.get<number>('port') ?? 3000,
        corsEnabled: !!this.configService.get('cors.origin'),
        helmetEnabled: this.configService.get<boolean>('security.helmet.enabled') ?? true,
        throttleLimit: this.configService.get<number>('throttle.limit') ?? 100,
      },
    };
  }

  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
  }
}
