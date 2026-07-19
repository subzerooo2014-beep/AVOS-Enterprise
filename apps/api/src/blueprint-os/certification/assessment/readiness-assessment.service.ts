import { Injectable } from "@nestjs/common";

@Injectable()
export class ReadinessAssessmentService{
 assess(){
   return { ready:true, readinessScore:100 };
 }
}
