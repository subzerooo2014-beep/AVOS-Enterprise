import { Module } from "@nestjs/common";
import { RollbackEngineService } from "./rollback-engine.service";
import { RollbackEngineController } from "./rollback-engine.controller";

@Module({
 providers:[RollbackEngineService],
 controllers:[RollbackEngineController],
 exports:[RollbackEngineService]
})
export class RollbackEngineModule{}
