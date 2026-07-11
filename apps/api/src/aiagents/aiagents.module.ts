import { Module } from "@nestjs/common";
import { AiagentsController } from "./aiagents.controller";
import { AiagentsService } from "./aiagents.service";

@Module({
 controllers:[AiagentsController],
 providers:[AiagentsService],
})
export class AiagentsModule{}
