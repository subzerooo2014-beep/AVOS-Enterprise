import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowGeneratorService{

 generate(name:string){
   return {
      generator:"workflow",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
