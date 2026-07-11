export interface AvosQuery<T = any> {
    type: string;
    source?: string;
    filters?: T;
    metadata?: any;
    correlationId?: string;
}
