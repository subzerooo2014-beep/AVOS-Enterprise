import { Injectable } from "@nestjs/common";

export type PublisherLifecycleState =
  | "queued"
  | "processing"
  | "published"
  | "failed"
  | "dead"
  | "skipped";

@Injectable()
export class PublisherJobLifecycleService {
  transition(
    current: PublisherLifecycleState,
    next: PublisherLifecycleState,
  ) {
    return {
      previous: current,
      current: next,
      changedAt: new Date(),
    };
  }

  isFinished(state: PublisherLifecycleState) {
    return ["published", "failed", "dead", "skipped"].includes(state);
  }

  isRunning(state: PublisherLifecycleState) {
    return state === "processing";
  }
}
