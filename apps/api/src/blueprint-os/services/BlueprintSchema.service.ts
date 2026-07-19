import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintSchemaService {
 status(){
   return {
      service:"BlueprintSchemaService",
      healthy:true,
      generatedAt:new Date().toISOString()
   };
 }
}
