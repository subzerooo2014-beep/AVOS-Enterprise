import { Module } from "@nestjs/common";
import { AstBuilderService } from "./ast-builder.service";
import { AstBuilderController } from "./ast-builder.controller";

@Module({
  providers:[AstBuilderService],
  controllers:[AstBuilderController],
  exports:[AstBuilderService]
})
export class AstBuilderModule {}
