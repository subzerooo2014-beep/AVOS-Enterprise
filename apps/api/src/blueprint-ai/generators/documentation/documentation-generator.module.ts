import { Module } from "@nestjs/common";
import { DocumentationGeneratorService } from "./documentation-generator.service";
import { DocumentationGeneratorController } from "./documentation-generator.controller";

@Module({
 providers:[DocumentationGeneratorService],
 controllers:[DocumentationGeneratorController]
})
export class DocumentationGeneratorModule{}
