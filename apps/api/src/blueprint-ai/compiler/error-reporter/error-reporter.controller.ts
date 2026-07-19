import { Body, Controller, Post } from "@nestjs/common";
import { ErrorReporterService } from "./error-reporter.service";

@Controller("compiler/error-reporter")
export class ErrorReporterController {

  constructor(
    private readonly service:ErrorReporterService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
