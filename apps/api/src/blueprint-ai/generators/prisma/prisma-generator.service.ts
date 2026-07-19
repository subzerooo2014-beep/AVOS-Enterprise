import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaGeneratorService{

 generate(name:string){
   return {
      generator:"prisma",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
