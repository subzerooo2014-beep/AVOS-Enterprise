import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobErrorService {
  normalize(error: any) {
    return {
      message: error?.message ?? "Unknown publisher error",
      stack: error?.stack ?? null,
      occurredAt: new Date(),
    };
  }
}
