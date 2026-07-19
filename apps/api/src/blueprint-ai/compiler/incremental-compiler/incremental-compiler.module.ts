import { Module } from "@nestjs/common";
import { IncrementalCompilerService } from "./incremental-compiler.service";
import { IncrementalCompilerController } from "./incremental-compiler.controller";

@Module({
  providers:[IncrementalCompilerService],
  controllers:[IncrementalCompilerController],
  exports:[IncrementalCompilerService]
})
export class IncrementalCompilerModule {}
