import { Module } from "@nestjs/common";
import { QueryGeneratorService } from "./query-generator.service";
import { QueryGeneratorController } from "./query-generator.controller";

@Module({
 providers:[QueryGeneratorService],
 controllers:[QueryGeneratorController]
})
export class QueryGeneratorModule{}
