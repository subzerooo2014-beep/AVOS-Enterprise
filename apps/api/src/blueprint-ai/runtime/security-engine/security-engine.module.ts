import { Module } from "@nestjs/common";
import { SecurityEngineService } from "./security-engine.service";
import { SecurityEngineController } from "./security-engine.controller";

@Module({
 providers:[SecurityEngineService],
 controllers:[SecurityEngineController],
 exports:[SecurityEngineService]
})
export class SecurityEngineModule{}
