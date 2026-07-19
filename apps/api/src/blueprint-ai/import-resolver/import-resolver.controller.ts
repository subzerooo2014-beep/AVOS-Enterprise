import { Body, Controller, Post } from "@nestjs/common";
import { ImportResolverService } from "./import-resolver.service";

@Controller("import-resolver")
export class ImportResolverController {

  constructor(
    private readonly service:ImportResolverService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
