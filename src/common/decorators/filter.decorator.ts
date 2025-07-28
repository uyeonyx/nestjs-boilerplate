import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BaseQueryDto } from '../dto/pagination.dto';
import { PaginationOptions, FilterCondition, DateRangeCondition } from '../types/pagination.types';

/**
 * 페이지네이션 옵션을 추출하는 데코레이터
 * @example
 * @Get()
 * async getItems(@Pagination() options: PaginationOptions) {
 *   return this.service.findMany(options);
 * }
 */
export const Pagination = createParamDecorator((data: unknown, ctx: ExecutionContext): PaginationOptions => {
  const request = ctx.switchToHttp().getRequest();
  const query = request.query as BaseQueryDto;

  const options: PaginationOptions = {
    page: query.page || 1,
    limit: query.limit || 10,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder || 'desc',
    search: query.search,
    searchFields: query.searchFields,
  };

  // 날짜 범위 필터 추가
  if (query.startDate || query.endDate) {
    options.dateRange = {
      field: 'createdAt', // 기본 필드, 필요시 오버라이드 가능
      startDate: query.startDate,
      endDate: query.endDate,
    };
  }

  return options;
});

/**
 * 특정 필드에 대한 필터를 추출하는 데코레이터
 * @param field 필터링할 필드명
 * @example
 * @Get()
 * async getItems(@Filter('status') statusFilter: string) {
 *   // status 필드 필터 사용
 * }
 */
export const Filter = createParamDecorator((field: string, ctx: ExecutionContext): any => {
  const request = ctx.switchToHttp().getRequest();
  const query = request.query;

  return query[field];
});

/**
 * 여러 필터 조건을 추출하는 데코레이터
 * @param allowedFields 허용된 필터 필드 목록
 * @example
 * @Get()
 * async getItems(@Filters(['status', 'category']) filters: FilterCondition[]) {
 *   // 여러 필터 조건 사용
 * }
 */
export const Filters = createParamDecorator((allowedFields: string[], ctx: ExecutionContext): FilterCondition[] => {
  const request = ctx.switchToHttp().getRequest();
  const query = request.query;
  const filters: FilterCondition[] = [];

  if (!allowedFields || allowedFields.length === 0) {
    return filters;
  }

  for (const field of allowedFields) {
    const value = query[field];
    if (value !== undefined && value !== null && value !== '') {
      // 기본적으로 equals 연산자 사용
      let operator: FilterCondition['operator'] = 'eq';
      let filterValue = value;

      // 특별한 연산자 처리
      if (typeof value === 'string') {
        if (value.startsWith('gt:')) {
          operator = 'gt';
          filterValue = value.substring(3);
        } else if (value.startsWith('gte:')) {
          operator = 'gte';
          filterValue = value.substring(4);
        } else if (value.startsWith('lt:')) {
          operator = 'lt';
          filterValue = value.substring(3);
        } else if (value.startsWith('lte:')) {
          operator = 'lte';
          filterValue = value.substring(4);
        } else if (value.startsWith('ne:')) {
          operator = 'ne';
          filterValue = value.substring(3);
        } else if (value.startsWith('like:')) {
          operator = 'like';
          filterValue = value.substring(5);
        } else if (value.startsWith('in:')) {
          operator = 'in';
          filterValue = value.substring(3).split(',');
        }
      }

      // 숫자 변환 시도
      if (typeof filterValue === 'string' && !isNaN(Number(filterValue))) {
        filterValue = Number(filterValue);
      }

      filters.push({
        field,
        operator,
        value: filterValue,
      });
    }
  }

  return filters;
});

/**
 * 날짜 범위 필터를 추출하는 데코레이터
 * @param field 날짜 필드명 (기본값: 'createdAt')
 * @example
 * @Get()
 * async getItems(@DateRangeFilter('updatedAt') dateRange: DateRangeCondition) {
 *   // 날짜 범위 필터 사용
 * }
 */
export const DateRangeFilter = createParamDecorator(
  (field: string = 'createdAt', ctx: ExecutionContext): DateRangeCondition | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query as BaseQueryDto;

    if (!query.startDate && !query.endDate) {
      return undefined;
    }

    return {
      field,
      startDate: query.startDate,
      endDate: query.endDate,
    };
  },
);

/**
 * 정렬 옵션을 추출하는 데코레이터
 * @param allowedFields 허용된 정렬 필드 목록
 * @example
 * @Get()
 * async getItems(@Sort(['name', 'createdAt']) sort: { field: string; order: 'asc' | 'desc' }) {
 *   // 정렬 옵션 사용
 * }
 */
export const Sort = createParamDecorator(
  (allowedFields: string[], ctx: ExecutionContext): { field: string; order: 'asc' | 'desc' } | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query as BaseQueryDto;

    if (!query.sortBy) {
      return undefined;
    }

    // 허용된 필드 검증
    if (allowedFields && allowedFields.length > 0 && !allowedFields.includes(query.sortBy)) {
      return undefined;
    }

    return {
      field: query.sortBy,
      order: query.sortOrder || 'desc',
    };
  },
);
