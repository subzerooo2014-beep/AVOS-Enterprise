import { Module } from "@nestjs/common";
import { GraphqlGeneratorService } from "./graphql-generator.service";
import { GraphqlGeneratorController } from "./graphql-generator.controller";

@Module({
 providers:[GraphqlGeneratorService],
 controllers:[GraphqlGeneratorController]
})
export class GraphqlGeneratorModule{}
