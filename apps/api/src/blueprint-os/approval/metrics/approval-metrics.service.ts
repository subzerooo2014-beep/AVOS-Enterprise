import { Injectable } from "@nestjs/common";

@Injectable()
export class ApprovalMetricsService{
 summary(){
   return {
     approvals:0,
     rejections:0,
     pending:0
   };
 }
}
