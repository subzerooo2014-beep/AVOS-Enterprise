import { Body, Controller, Post } from "@nestjs/common";
import { ProjectWriterService } from "./project-writer.service";

@Controller("project-writer")
export class ProjectWriterController {

  constructor(
    private readonly service:ProjectWriterService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
