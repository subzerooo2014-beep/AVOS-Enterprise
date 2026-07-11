import {
  DEFAULT_SALES_LIMIT,
  DEFAULT_SALES_PAGE,
  MAX_SALES_LIMIT,
} from '../constants/sales.constants';

export function normalizeSalesPaging(query: any = {}) {
  const page = Math.max(Number(query.page ?? DEFAULT_SALES_PAGE), 1);
  const limit = Math.min(
    Math.max(Number(query.limit ?? query.take ?? DEFAULT_SALES_LIMIT), 1),
    MAX_SALES_LIMIT,
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function buildSalesWhere(query: any = {}) {
  const where: any = {};

  if (query.status) where.status = query.status;
  if (query.customerId) where.customerId = query.customerId;
  if (query.vehicleId) where.vehicleId = query.vehicleId;

  if (query.search) {
    where.OR = [
      { number: { contains: query.search, mode: 'insensitive' } },
      { customerName: { contains: query.search, mode: 'insensitive' } },
      { customerPhone: { contains: query.search, mode: 'insensitive' } },
      { customerEmail: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  return where;
}
