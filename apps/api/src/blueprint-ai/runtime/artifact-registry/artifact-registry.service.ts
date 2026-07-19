import { Injectable } from "@nestjs/common";

@Injectable()
export class ArtifactRegistryService{

 execute(context:any){
   return {
      module:"artifact-registry",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
