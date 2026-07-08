import { DEFAULT_CRM_LIMIT, DEFAULT_CRM_PAGE, MAX_CRM_LIMIT } from "../constants/crm.constants";

export function normalizeCrmPaging(query: any = {}) {
  const page = Math.max(Number(query.page ?? DEFAULT_CRM_PAGE), 1);
  const limit = Math.min(Math.max(Number(query.limit ?? query.take ?? DEFAULT_CRM_LIMIT), 1), MAX_CRM_LIMIT);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function buildCrmWhere(query: any = {}) {
  const where: any = {};

  if (query.status) where.status = query.status;
  if (query.priority) where.priority = query.priority;
  if (query.assignedToId) where.assignedToId = query.assignedToId;
  if (query.customerId) where.customerId = query.customerId;
  if (query.vehicleId) where.vehicleId = query.vehicleId;
  if (query.source) where.source = query.source;

  if (query.search) {
    where.OR = [
      { number: { contains: query.search, mode: "insensitive" } },
      { name: { contains: query.search, mode: "insensitive" } },
      { phone: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
      { source: { contains: query.search, mode: "insensitive" } },
    ];
  }

  return where;
}
