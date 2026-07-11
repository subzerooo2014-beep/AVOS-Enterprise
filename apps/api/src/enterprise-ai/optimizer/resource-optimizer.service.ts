import { Injectable } from "@nestjs/common";

@Injectable()
export class ResourceOptimizerService{
  optimize(input:any){
    return{
      utilization:95,
      recommendations:[
        "Balance inventory",
        "Increase sales capacity"
      ],
    };
  }
}
