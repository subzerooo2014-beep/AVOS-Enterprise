import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobStateService {
  next(status: string) {
    switch (status) {
      case "queued":
        return "processing";
      case "processing":
        return "published";
      case "failed":
        return "queued";
      default:
        return status;
    }
  }
}
