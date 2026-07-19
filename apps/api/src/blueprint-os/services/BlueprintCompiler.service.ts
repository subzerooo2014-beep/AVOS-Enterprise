import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintCompilerService {
 status(){
   return {
      service:"BlueprintCompilerService",
      healthy:true,
      generatedAt:new Date().toISOString()
   };
 }
}
