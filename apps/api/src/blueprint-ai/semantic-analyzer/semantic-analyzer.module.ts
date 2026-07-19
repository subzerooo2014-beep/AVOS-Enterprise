import { Module } from "@nestjs/common";
import { SemanticAnalyzerService } from "./semantic-analyzer.service";
import { SemanticAnalyzerController } from "./semantic-analyzer.controller";

@Module({
  providers:[SemanticAnalyzerService],
  controllers:[SemanticAnalyzerController],
  exports:[SemanticAnalyzerService]
})
export class SemanticAnalyzerModule {}
