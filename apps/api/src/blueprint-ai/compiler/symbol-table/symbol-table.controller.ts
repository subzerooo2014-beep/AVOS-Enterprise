import { Body, Controller, Post } from "@nestjs/common";
import { SymbolTableService } from "./symbol-table.service";

@Controller("compiler/symbol-table")
export class SymbolTableController {

  constructor(
    private readonly service:SymbolTableService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
