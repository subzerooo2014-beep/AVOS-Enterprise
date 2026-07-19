import { Module } from "@nestjs/common";
import { QualityMonitorService } from "./quality-monitor.service";
import { QualityMonitorController } from "./quality-monitor.controller";

@Module({
 providers:[QualityMonitorService],
 controllers:[QualityMonitorController],
 exports:[QualityMonitorService]
})
export class QualityMonitorModule{}
