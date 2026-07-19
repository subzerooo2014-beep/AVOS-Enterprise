import { Module } from "@nestjs/common";
import { PromptCompilerService } from "./prompt-compiler.service";
import { PromptCompilerController } from "./prompt-compiler.controller";

@Module({
  providers:[PromptCompilerService],
  controllers:[PromptCompilerController],
  exports:[PromptCompilerService]
})
export class PromptCompilerModule {}
