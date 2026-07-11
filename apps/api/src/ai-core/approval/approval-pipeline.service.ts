import { Injectable } from "@nestjs/common";

@Injectable()
export class ApprovalPipelineService{

 evaluate(item:any){

   return{
      approved:true,
      stage:"AI_REVIEW",
      confidence:96,
      item,
   };

 }

}
