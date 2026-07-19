import { Module } from "@nestjs/common";
import { TokenizerService } from "./tokenizer.service";
import { TokenizerController } from "./tokenizer.controller";

@Module({
  providers:[TokenizerService],
  controllers:[TokenizerController],
  exports:[TokenizerService]
})
export class TokenizerModule {}
