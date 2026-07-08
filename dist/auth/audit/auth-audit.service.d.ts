export declare class AuthAuditService {
    log(action: string, userId?: string): {
        action: string;
        userId: string | undefined;
        timestamp: string;
    };
}
