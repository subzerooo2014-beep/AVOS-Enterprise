export type PublisherStatus = "healthy" | "degraded" | "offline";
export type PublishResultStatus = "published" | "failed" | "skipped";
export type PublishJobStatus = "queued" | "locked" | "processing" | "published" | "failed" | "retrying" | "skipped" | "dead";
export interface PublisherContext {
    jobId: string;
    vehicleId?: string | null;
    campaignId?: string | null;
    channelId?: string | null;
    channel: string;
    title: string;
    content?: string | null;
    result?: any;
    attempt: number;
    correlationId?: string | null;
    metadata?: any;
}
export interface PublisherResult {
    status: PublishResultStatus;
    channel: string;
    externalId?: string | null;
    message: string;
    metadata?: any;
}
export interface PublisherAdapter {
    channel: string;
    health(): Promise<PublisherStatus>;
    publish(ctx: PublisherContext): Promise<PublisherResult>;
}
