import { Injectable } from "@nestjs/common";
import { PublisherContextBuilderService } from "./publisher-context-builder.service";

@Injectable()
export class PublisherPreviewService {
  constructor(private readonly contextBuilder: PublisherContextBuilderService) {}

  preview(input: any) {
    const fakeJob = {
      id: input.id ?? "preview",
      title: input.title,
      content: input.content ?? null,
      campaignId: input.campaignId ?? null,
      channelId: input.channelId ?? null,
      retryCount: 0,
      result: input.result ?? {},
    };

    return {
      success: true,
      preview: {
        context: this.contextBuilder.build(fakeJob),
        title: input.title,
        content: input.content ?? "",
        channel: input.result?.channel ?? "internal",
        generatedAt: new Date(),
      },
    };
  }
}
