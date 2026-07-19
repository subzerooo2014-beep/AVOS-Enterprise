import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryGeneratorService{

 generate(name:string){
   return {
      generator:"repository",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
