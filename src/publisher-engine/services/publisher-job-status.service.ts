import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobStatusService {
  canDispatch(status: string) {
    return status === "queued";
  }

  successStatus() {
    return "published";
  }

  failureStatus(retryable: boolean) {
    return retryable ? "queued" : "dead";
  }
}
