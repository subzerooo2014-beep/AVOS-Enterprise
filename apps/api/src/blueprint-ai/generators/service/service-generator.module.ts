import { Module } from "@nestjs/common";
import { ServiceGeneratorService } from "./service-generator.service";
import { ServiceGeneratorController } from "./service-generator.controller";

@Module({
 providers:[ServiceGeneratorService],
 controllers:[ServiceGeneratorController]
})
export class ServiceGeneratorModule{}
