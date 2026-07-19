import { Module } from "@nestjs/common";
import { AuditEngineService } from "./audit-engine.service";
import { AuditEngineController } from "./audit-engine.controller";

@Module({
 providers:[AuditEngineService],
 controllers:[AuditEngineController],
 exports:[AuditEngineService]
})
export class AuditEngineModule{}
