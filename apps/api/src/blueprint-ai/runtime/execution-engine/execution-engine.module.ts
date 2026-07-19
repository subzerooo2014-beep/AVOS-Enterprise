import { Module } from "@nestjs/common";
import { ExecutionEngineService } from "./execution-engine.service";
import { ExecutionEngineController } from "./execution-engine.controller";

@Module({
 providers:[ExecutionEngineService],
 controllers:[ExecutionEngineController],
 exports:[ExecutionEngineService]
})
export class ExecutionEngineModule{}
