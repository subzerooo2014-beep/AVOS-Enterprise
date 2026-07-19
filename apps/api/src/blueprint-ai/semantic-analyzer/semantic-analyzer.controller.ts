import { Body, Controller, Post } from "@nestjs/common";
import { SemanticAnalyzerService } from "./semantic-analyzer.service";

@Controller("semantic-analyzer")
export class SemanticAnalyzerController {

  constructor(
    private readonly service:SemanticAnalyzerService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
