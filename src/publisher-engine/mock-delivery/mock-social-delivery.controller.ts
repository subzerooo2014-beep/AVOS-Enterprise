import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
} from "@nestjs/common";

import { MockSocialDeliveryService } from "./mock-social-delivery.service";

@Controller("publisher-engine/mock-delivery")
export class MockSocialDeliveryController {
  constructor(
    private readonly service: MockSocialDeliveryService,
  ) {}

  @Post(":channel")
  deliver(
    @Param("channel")
    channel: string,

    @Body()
    body: any,

    @Headers()
    headers: Record<string, any>,
  ) {
    return this.service.deliver(
      channel,
      body,
      headers,
    );
  }
}
