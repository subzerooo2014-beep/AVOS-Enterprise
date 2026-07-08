export declare function normalizeFollowUpDate(value: any): Date | null;
export declare function isFollowUpOverdue(value: any, now?: Date): boolean;
export declare function getFollowUpBucket(value: any, now?: Date): "NONE" | "OVERDUE" | "TODAY" | "UPCOMING";
