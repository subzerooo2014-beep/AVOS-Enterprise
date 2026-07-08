export declare class AuditEvent {
    action: string;
    entity: string;
    entityId?: string | undefined;
    userId?: string | undefined;
    constructor(action: string, entity: string, entityId?: string | undefined, userId?: string | undefined);
}
