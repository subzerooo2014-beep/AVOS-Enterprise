import { Module } from "@nestjs/common";
import { ArchitectureValidatorService } from "./architecture-validator.service";
import { ArchitectureValidatorController } from "./architecture-validator.controller";

@Module({
  providers:[ArchitectureValidatorService],
  controllers:[ArchitectureValidatorController],
  exports:[ArchitectureValidatorService]
})
export class ArchitectureValidatorModule {}
