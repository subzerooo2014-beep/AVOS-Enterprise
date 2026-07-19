import { Module } from "@nestjs/common";
import { EventGeneratorService } from "./event-generator.service";
import { EventGeneratorController } from "./event-generator.controller";

@Module({
 providers:[EventGeneratorService],
 controllers:[EventGeneratorController]
})
export class EventGeneratorModule{}
