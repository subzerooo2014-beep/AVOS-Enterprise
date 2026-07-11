import {
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { SocialDeliveryWorkerService } from "./social-delivery-worker.service";

@Controller("publisher-engine/social-delivery")
export class SocialDeliveryController {
  constructor(
    private readonly worker: SocialDeliveryWorkerService,
  ) {}

  @Get("status")
  status() {
    return this.worker.status();
  }

  @Get("credentials")
  credentials() {
    return this.worker.credentialsReadiness();
  }

  @Get("queue")
  queue(
    @Query("limit")
    limit?: string,
  ) {
    return this.worker.queue(
      limit
        ? Number(limit)
        : 50,
    );
  }

  @Post("run")
  run(
    @Query("limit")
    limit?: string,
  ) {
    return this.worker.runOnce(
      limit
        ? Number(limit)
        : 10,
    );
  }

  @Post("requeue")
  requeue(
    @Query("channel")
    channel?: string,
  ) {
    return this.worker.requeueAwaitingCredentials(
      channel,
    );
  }

  @Post("requeue-run")
  requeueAndRun(
    @Query("channel")
    channel?: string,

    @Query("limit")
    limit?: string,
  ) {
    return this.worker.requeueAndRun(
      channel,
      limit
        ? Number(limit)
        : 10,
    );
  }

  @Post("event/:id")
  processEvent(
    @Param("id")
    id: string,
  ) {
    return this.worker.processById(
      id,
    );
  }
}
