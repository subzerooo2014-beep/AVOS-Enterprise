import { Module } from "@nestjs/common";
import { HandlerGeneratorService } from "./handler-generator.service";
import { HandlerGeneratorController } from "./handler-generator.controller";

@Module({
 providers:[HandlerGeneratorService],
 controllers:[HandlerGeneratorController]
})
export class HandlerGeneratorModule{}
