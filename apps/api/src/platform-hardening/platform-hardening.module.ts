import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";

import {
  APP_FILTER,
} from "@nestjs/core";

import {
  RequestContextMiddleware,
} from "./request-context.middleware";

import {
  SecurityHeadersMiddleware,
} from "./security-headers.middleware";

import {
  PlatformExceptionFilter,
} from "./platform-exception.filter";

import {
  PlatformHardeningService,
} from "./platform-hardening.service";

import {
  PlatformHardeningController,
} from "./platform-hardening.controller";

@Module({
  controllers: [
    PlatformHardeningController,
  ],

  providers: [
    PlatformHardeningService,

    {
      provide:
        APP_FILTER,

      useClass:
        PlatformExceptionFilter,
    },
  ],

  exports: [
    PlatformHardeningService,
  ],
})
export class PlatformHardeningModule
  implements NestModule
{
  configure(
    consumer: MiddlewareConsumer,
  ): void {
    consumer
      .apply(
        RequestContextMiddleware,
        SecurityHeadersMiddleware,
      )
      .forRoutes({
        path: "*",
        method:
          RequestMethod.ALL,
      });
  }
}
