import { Injectable } from "@nestjs/common";

@Injectable()
export class SimulationEngineService{
  simulate(model:any){
    return{
      scenarios:["BEST","EXPECTED","WORST"],
      model,
    };
  }
}
