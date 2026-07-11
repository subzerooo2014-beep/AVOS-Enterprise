import { PublisherContextBuilderService } from "./publisher-context-builder.service";
export declare class PublisherPreviewService {
    private readonly contextBuilder;
    constructor(contextBuilder: PublisherContextBuilderService);
    preview(input: any): {
        success: boolean;
        preview: {
            context: import("..").PublisherContext;
            title: any;
            content: any;
            channel: any;
            generatedAt: Date;
        };
    };
}
