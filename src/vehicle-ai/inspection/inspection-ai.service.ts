import { Injectable } from "@nestjs/common";

@Injectable()
export class InspectionAiService{
 inspect(input:any){
  return{
   score:95,
   issues:[],
   recommendation:"Manual verification recommended until Vision provider is connected.",
  };
 }
}
