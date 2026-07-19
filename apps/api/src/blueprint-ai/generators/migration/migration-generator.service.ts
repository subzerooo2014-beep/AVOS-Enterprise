import { Injectable } from "@nestjs/common";

@Injectable()
export class MigrationGeneratorService{

 generate(name:string){
   return {
      generator:"migration",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
