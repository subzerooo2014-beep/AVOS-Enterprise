import { Module } from "@nestjs/common";
import { ValidatorGeneratorService } from "./validator-generator.service";
import { ValidatorGeneratorController } from "./validator-generator.controller";

@Module({
 providers:[ValidatorGeneratorService],
 controllers:[ValidatorGeneratorController]
})
export class ValidatorGeneratorModule{}
