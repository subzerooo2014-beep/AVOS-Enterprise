import { Module } from "@nestjs/common";
import { DigitalDnaPoliciesController } from "./policies.controller";
import { DigitalDnaPoliciesService } from "./policies.service";

@Module({
  controllers: [DigitalDnaPoliciesController],
  providers: [DigitalDnaPoliciesService],
  exports: [DigitalDnaPoliciesService],
})
export class DigitalDnaPoliciesModule {}