import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherWorkerSessionService {
  open(workerId: string) {
    return {
      workerId,
      openedAt: new Date(),
    };
  }

  close(workerId: string) {
    return {
      workerId,
      closedAt: new Date(),
    };
  }
}
