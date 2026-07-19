import { Injectable } from "@nestjs/common";

@Injectable()
export class TestGeneratorService{

 generate(name:string){
   return {
      generator:"test",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
