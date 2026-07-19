import { Body, Controller, Post } from "@nestjs/common";
import { MigrationGeneratorService } from "./migration-generator.service";

@Controller("generator/migration")
export class MigrationGeneratorController{

 constructor(private readonly service:MigrationGeneratorService){}

 @Post()
 generate(@Body() body:{name:string}){
    return this.service.generate(body.name);
 }

}
