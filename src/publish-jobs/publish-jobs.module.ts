import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { PublisherEngineModule } from "../publisher-engine/publisher-engine.module";

import { PublishJobsController } from "./publish-jobs.controller";
import { PublishJobsService } from "./publish-jobs.service";

@Module({
  imports: [
    PrismaModule,
    PublisherEngineModule,
  ],

  controllers: [
    PublishJobsController,
  ],

  providers: [
    PublishJobsService,
  ],

  exports: [
    PublishJobsService,
  ],
})
export class PublishJobsModule {}
