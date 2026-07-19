import { Module } from "@nestjs/common";
import { SdkGeneratorService } from "./sdk-generator.service";
import { SdkGeneratorController } from "./sdk-generator.controller";

@Module({
 providers:[SdkGeneratorService],
 controllers:[SdkGeneratorController]
})
export class SdkGeneratorModule{}
