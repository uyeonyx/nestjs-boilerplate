import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PackageUtil } from './package.util';

/**
 * Swagger 설정을 관리하는 유틸리티
 *
 * @example
 * // 기본 설정으로 Swagger 셋업
 * SwaggerUtil.setupDefault(app, [UserDto, PostDto]);
 *
 * @example
 * // 커스텀 설정으로 Swagger 셋업
 * SwaggerUtil.setup(app, {
 *   path: 'docs',
 *   title: 'My API',
 *   description: 'Custom API Description',
 *   tags: [
 *     { name: 'Users', description: 'User management' },
 *     { name: 'Posts', description: 'Post management' }
 *   ]
 * });
 */
export class SwaggerUtil {
  /**
   * Swagger 문서 설정 및 셋업
   * @param app NestJS 애플리케이션 인스턴스
   * @param options Swagger 설정 옵션
   */
  static setup(
    app: INestApplication,
    options?: {
      path?: string;
      title?: string;
      description?: string;
      version?: string;
      tags?: Array<{ name: string; description: string }>;
      extraModels?: any[];
    },
  ): void {
    const {
      path = 'api-docs',
      title = PackageUtil.getName(),
      description = PackageUtil.getFormattedDescription(),
      version = PackageUtil.getVersion(),
      tags = [{ name: 'Application', description: '애플리케이션 기본 기능' }],
      extraModels = [],
    } = options || {};

    // Swagger 문서 설정
    const config = new DocumentBuilder().setTitle(title).setDescription(description).setVersion(version).addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'JWT 토큰을 입력하세요',
      in: 'header',
    });

    // 태그 추가
    tags.forEach((tag) => {
      config.addTag(tag.name, tag.description);
    });

    const document = SwaggerModule.createDocument(app, config.build(), {
      extraModels,
      deepScanRoutes: true,
    });

    // Swagger UI 설정
    SwaggerModule.setup(path, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
        tryItOutEnabled: true,
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
      },
      customSiteTitle: `${title} - API Documentation`,
      customfavIcon: '/favicon.ico',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
      customCssUrl: ['https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css'],
    });
  }

  /**
   * 기본 Swagger 설정으로 셋업 (간단한 버전)
   * @param app NestJS 애플리케이션 인스턴스
   * @param extraModels 추가할 모델들
   */
  static setupDefault(app: INestApplication, extraModels: any[] = []): void {
    this.setup(app, { extraModels });
  }

  /**
   * 커스텀 Swagger 설정으로 셋업
   * @param app NestJS 애플리케이션 인스턴스
   * @param config 커스텀 설정
   */
  static setupCustom(
    app: INestApplication,
    config: {
      path: string;
      title: string;
      description: string;
      version: string;
      tags: Array<{ name: string; description: string }>;
      extraModels: any[];
    },
  ): void {
    this.setup(app, config);
  }

  /**
   * Swagger 문서 URL 생성
   * @param baseUrl 기본 URL
   * @param path Swagger 경로 (기본값: 'api-docs')
   * @returns 완전한 Swagger URL
   */
  static getDocumentationUrl(baseUrl: string, path: string = 'api-docs'): string {
    return `${baseUrl.replace(/\/$/, '')}/${path}`;
  }
}
