import { Module } from "@nestjs/common";
import { AnalyticsaiController } from "./analyticsai.controller";
import { AnalyticsaiService } from "./analyticsai.service";

@Module({
  controllers:[AnalyticsaiController],
  providers:[AnalyticsaiService],
})
export class AnalyticsaiModule{}
