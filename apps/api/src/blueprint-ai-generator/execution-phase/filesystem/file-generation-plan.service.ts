import { Injectable } from "@nestjs/common";

@Injectable()
export class FileGenerationPlanService{
 create(files:string[]){
   return {
     ready:true,
     total:files.length,
     files
   };
 }
}
