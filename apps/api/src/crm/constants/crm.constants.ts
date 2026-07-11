export const CRM_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "OPPORTUNITY",
  "WON",
  "LOST",
  "INACTIVE",
] as const;

export const CRM_PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
export const CRM_ACTIVITY_TYPES = ["CALL", "EMAIL", "MEETING", "WHATSAPP", "NOTE", "TASK", "FOLLOW_UP"] as const;

export type CrmStatus = typeof CRM_STATUSES[number];
export type CrmPriority = typeof CRM_PRIORITIES[number];
export type CrmActivityType = typeof CRM_ACTIVITY_TYPES[number];

export const DEFAULT_CRM_PAGE = 1;
export const DEFAULT_CRM_LIMIT = 20;
export const MAX_CRM_LIMIT = 100;
