import { Injectable } from "@nestjs/common";

@Injectable()
export class ValidatorGeneratorService{

 generate(name:string){
   return {
      generator:"validator",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
