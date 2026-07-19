import { Injectable } from "@nestjs/common";

@Injectable()
export class CommandGeneratorService{

 generate(name:string){
   return {
      generator:"command",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
