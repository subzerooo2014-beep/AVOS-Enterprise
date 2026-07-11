import {
  Controller,
  Get,
} from "@nestjs/common";

import {
  PlatformHardeningService,
} from "./platform-hardening.service";

@Controller(
  "platform-hardening",
)
export class PlatformHardeningController {
  constructor(
    private readonly service:
      PlatformHardeningService,
  ) {}

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("error-test")
  errorTest() {
    throw new Error(
      "AVOS controlled exception test.",
    );
  }
}
