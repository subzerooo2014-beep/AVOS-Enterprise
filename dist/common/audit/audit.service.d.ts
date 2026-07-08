export declare class AuditService {
    log(action: string, entity: string, entityId?: string, userId?: string): {
        action: string;
        entity: string;
        entityId: string | undefined;
        userId: string | undefined;
        createdAt: string;
    };
}
