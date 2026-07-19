import { Injectable } from "@nestjs/common";

@Injectable()
export class PolicyGeneratorService{

 generate(name:string){
   return {
      generator:"policy",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
