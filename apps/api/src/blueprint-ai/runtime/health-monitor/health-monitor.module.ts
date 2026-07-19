import { Module } from "@nestjs/common";
import { HealthMonitorService } from "./health-monitor.service";
import { HealthMonitorController } from "./health-monitor.controller";

@Module({
 providers:[HealthMonitorService],
 controllers:[HealthMonitorController],
 exports:[HealthMonitorService]
})
export class HealthMonitorModule{}
