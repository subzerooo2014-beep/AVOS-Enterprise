export const SALES_STATUSES = [
  'OPEN',
  'DRAFT',
  'PENDING_APPROVAL',
  'APPROVED',
  'WON',
  'LOST',
  'CANCELLED',
  'CLOSED',
] as const;

export const FINAL_SALES_STATUSES = ['WON', 'LOST', 'CANCELLED', 'CLOSED'] as const;

export const ACTIVE_SALES_STATUSES = ['OPEN', 'DRAFT', 'PENDING_APPROVAL', 'APPROVED'] as const;

export const DEFAULT_SALES_PAGE = 1;
export const DEFAULT_SALES_LIMIT = 20;
export const MAX_SALES_LIMIT = 100;
