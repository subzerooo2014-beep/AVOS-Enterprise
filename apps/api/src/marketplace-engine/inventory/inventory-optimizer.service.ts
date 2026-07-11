import { Injectable } from "@nestjs/common";

@Injectable()
export class InventoryOptimizerService{
  optimize(items:any[]){
    return{
      optimized:true,
      suggestions:[
        "Move slow vehicles",
        "Promote high demand vehicles",
        "Reduce aged inventory",
      ],
    };
  }
}
