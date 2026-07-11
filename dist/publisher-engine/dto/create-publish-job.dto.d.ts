export declare class CreatePublishJobDto {
    title: string;
    content?: string;
    campaignId?: string;
    channelId?: string;
    priority?: string;
    scheduledAt?: string;
    maxRetries?: number;
    result?: any;
}
export declare class CreatePublishJobsBatchDto {
    items: CreatePublishJobDto[];
}
