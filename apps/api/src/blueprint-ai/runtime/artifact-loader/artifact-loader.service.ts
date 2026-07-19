import { Injectable } from "@nestjs/common";

@Injectable()
export class ArtifactLoaderService{

 execute(context:any){
   return {
      module:"artifact-loader",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
