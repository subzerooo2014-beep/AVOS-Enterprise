export class PublisherResultUtil {
  static published(channel: string, externalId: string, metadata?: any) {
    return {
      status: "published",
      channel,
      externalId,
      message: "Publisher completed successfully.",
      metadata: metadata ?? {},
    };
  }

  static failed(channel: string, message: string, metadata?: any) {
    return {
      status: "failed",
      channel,
      message,
      metadata: metadata ?? {},
    };
  }

  static skipped(channel: string, reason: string) {
    return {
      status: "skipped",
      channel,
      message: reason,
      metadata: {},
    };
  }
}
