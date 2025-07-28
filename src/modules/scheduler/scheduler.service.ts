import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  // // 매분 실행되는 크론 작업 예시
  // @Cron(CronExpression.EVERY_MINUTE)
  // handleCronEveryMinute() {
  //   this.logger.log('매분 실행되는 크론 작업이 실행되었습니다.');
  // }

  // // 매일 자정에 실행되는 크론 작업 예시
  // @Cron('0 0 * * *')
  // handleCronDaily() {
  //   this.logger.log('매일 자정에 실행되는 크론 작업이 실행되었습니다.');
  // }

  // // 10초마다 실행되는 인터벌 작업 예시
  // @Interval(10000)
  // handleInterval() {
  //   this.logger.log('10초마다 실행되는 인터벌 작업이 실행되었습니다.');
  // }

  // // 애플리케이션 시작 후 5초 후에 한 번 실행되는 타임아웃 작업 예시
  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.log('애플리케이션 시작 후 5초 후에 실행되는 타임아웃 작업이 실행되었습니다.');
  // }

  // // 커스텀 작업 메서드
  // executeCustomTask(taskName: string) {
  //   this.logger.log(`커스텀 작업 "${taskName}"이 실행되었습니다.`);
  // }
}
