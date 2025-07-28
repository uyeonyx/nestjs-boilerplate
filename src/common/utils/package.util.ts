import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * package.json에서 정보를 읽어오는 유틸리티
 */
export class PackageUtil {
  private static packageJson: any = null;

  /**
   * package.json 파일을 읽어와서 파싱
   */
  private static getPackageJson(): any {
    if (this.packageJson) {
      return this.packageJson;
    }

    try {
      const packageJsonPath = join(process.cwd(), 'package.json');
      const content = readFileSync(packageJsonPath, 'utf8');
      this.packageJson = JSON.parse(content);
      return this.packageJson;
    } catch (error) {
      console.warn('Failed to read package.json:', error.message);
      return {};
    }
  }

  /**
   * package.json에서 버전 정보 반환
   * @returns 버전 문자열 (기본값: '1.0.0')
   */
  static getVersion(): string {
    const pkg = this.getPackageJson();
    return pkg.version || process.env.npm_package_version || '1.0.0';
  }

  /**
   * package.json에서 애플리케이션 이름 반환
   * @returns 애플리케이션 이름
   */
  static getName(): string {
    const pkg = this.getPackageJson();
    return pkg.name || 'NestJS Application';
  }

  /**
   * package.json에서 설명 반환 (원본)
   * @returns 애플리케이션 설명
   */
  static getDescription(): string {
    const pkg = this.getPackageJson();
    return pkg.description || '';
  }

  /**
   * package.json에서 설명 반환 (줄바꿈 처리)
   * @returns 줄바꿈이 처리된 애플리케이션 설명
   */
  static getFormattedDescription(): string {
    const description = this.getDescription();
    // \n을 실제 줄바꿈으로 변환
    return description.replace(/\\n/g, '\n');
  }

  /**
   * package.json에서 설명 반환 (HTML 형식)
   * @returns HTML 형식으로 변환된 애플리케이션 설명
   */
  static getHtmlDescription(): string {
    const description = this.getDescription();
    // \n을 <br>로 변환
    return description.replace(/\\n/g, '<br>');
  }

  /**
   * package.json에서 설명 반환 (Markdown 형식)
   * @returns Markdown 형식으로 변환된 애플리케이션 설명
   */
  static getMarkdownDescription(): string {
    const description = this.getDescription();
    // \n을 실제 줄바꿈으로 변환하고 리스트 항목 처리
    return description.replace(/\\n/g, '\n').replace(/^- /gm, '* ');
  }

  /**
   * package.json에서 작성자 정보 반환
   * @returns 작성자 정보
   */
  static getAuthor(): string {
    const pkg = this.getPackageJson();
    return pkg.author || '';
  }

  /**
   * 캐시된 package.json 정보를 초기화 (테스트용)
   */
  static clearCache(): void {
    this.packageJson = null;
  }
}
