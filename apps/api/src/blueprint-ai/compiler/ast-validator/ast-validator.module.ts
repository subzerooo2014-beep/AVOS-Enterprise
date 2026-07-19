import { Module } from "@nestjs/common";
import { AstValidatorService } from "./ast-validator.service";
import { AstValidatorController } from "./ast-validator.controller";

@Module({
  providers:[AstValidatorService],
  controllers:[AstValidatorController],
  exports:[AstValidatorService]
})
export class AstValidatorModule {}
