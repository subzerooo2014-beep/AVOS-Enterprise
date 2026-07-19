import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintMetadataService {
 status(){
   return {
      service:"BlueprintMetadataService",
      healthy:true,
      generatedAt:new Date().toISOString()
   };
 }
}
