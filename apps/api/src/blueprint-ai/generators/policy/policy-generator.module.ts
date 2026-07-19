import { Module } from "@nestjs/common";
import { PolicyGeneratorService } from "./policy-generator.service";
import { PolicyGeneratorController } from "./policy-generator.controller";

@Module({
 providers:[PolicyGeneratorService],
 controllers:[PolicyGeneratorController]
})
export class PolicyGeneratorModule{}
