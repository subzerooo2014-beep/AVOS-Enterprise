import { Injectable } from "@nestjs/common";

@Injectable()
export class SdkGeneratorService{

 generate(name:string){
   return {
      generator:"sdk",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
