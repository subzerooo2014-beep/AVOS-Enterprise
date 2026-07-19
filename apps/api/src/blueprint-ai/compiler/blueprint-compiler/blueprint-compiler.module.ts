import { Module } from "@nestjs/common";
import { BlueprintCompilerService } from "./blueprint-compiler.service";
import { BlueprintCompilerController } from "./blueprint-compiler.controller";

@Module({
  providers:[BlueprintCompilerService],
  controllers:[BlueprintCompilerController],
  exports:[BlueprintCompilerService]
})
export class BlueprintCompilerModule {}
