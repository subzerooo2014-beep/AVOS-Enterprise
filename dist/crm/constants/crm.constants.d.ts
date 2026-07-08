export declare const CRM_STATUSES: readonly ["NEW", "CONTACTED", "QUALIFIED", "OPPORTUNITY", "WON", "LOST", "INACTIVE"];
export declare const CRM_PRIORITIES: readonly ["LOW", "NORMAL", "HIGH", "URGENT"];
export declare const CRM_ACTIVITY_TYPES: readonly ["CALL", "EMAIL", "MEETING", "WHATSAPP", "NOTE", "TASK", "FOLLOW_UP"];
export type CrmStatus = typeof CRM_STATUSES[number];
export type CrmPriority = typeof CRM_PRIORITIES[number];
export type CrmActivityType = typeof CRM_ACTIVITY_TYPES[number];
export declare const DEFAULT_CRM_PAGE = 1;
export declare const DEFAULT_CRM_LIMIT = 20;
export declare const MAX_CRM_LIMIT = 100;
