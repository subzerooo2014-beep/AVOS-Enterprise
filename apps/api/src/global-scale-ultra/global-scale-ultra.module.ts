import { Module } from "@nestjs/common";
import { GlobalScaleUltraController } from "./global-scale-ultra.controller";
import { GlobalScaleUltraService } from "./global-scale-ultra.service";
@Module({controllers:[GlobalScaleUltraController],providers:[GlobalScaleUltraService],exports:[GlobalScaleUltraService]})
export class GlobalScaleUltraModule {}