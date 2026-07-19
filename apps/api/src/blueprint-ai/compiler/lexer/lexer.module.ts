import { Module } from "@nestjs/common";
import { LexerService } from "./lexer.service";
import { LexerController } from "./lexer.controller";

@Module({
  providers:[LexerService],
  controllers:[LexerController],
  exports:[LexerService]
})
export class LexerModule {}
