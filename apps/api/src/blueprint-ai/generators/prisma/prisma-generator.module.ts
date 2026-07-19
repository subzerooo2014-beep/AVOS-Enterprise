import { Module } from "@nestjs/common";
import { PrismaGeneratorService } from "./prisma-generator.service";
import { PrismaGeneratorController } from "./prisma-generator.controller";

@Module({
 providers:[PrismaGeneratorService],
 controllers:[PrismaGeneratorController]
})
export class PrismaGeneratorModule{}
