export interface AvosEvent {
    id?: string;
    type: string;
    source?: string;
    entityType?: string;
    entityId?: string;
    payload?: any;
    metadata?: any;
    correlationId?: string;
    createdAt?: Date;
}
