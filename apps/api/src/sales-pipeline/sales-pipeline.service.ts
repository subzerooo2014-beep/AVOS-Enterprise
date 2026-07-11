import { Injectable } from "@nestjs/common";

@Injectable()
export class SalesPipelineService {
  nextStage(stage:string){
    const flow = ["NEW","CONTACTED","NEGOTIATION","WON"];
    const index = flow.indexOf(stage);
    return index >= 0 && index < flow.length - 1 ? flow[index + 1] : stage;
  }

  calculateProbability(stage:string){
    if(stage === "WON") return 100;
    if(stage === "NEGOTIATION") return 70;
    if(stage === "CONTACTED") return 40;
    return 10;
  }
}
