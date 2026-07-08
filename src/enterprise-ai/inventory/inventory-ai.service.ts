import { Injectable } from "@nestjs/common";

@Injectable()
export class InventoryAiService{
 optimize(items:any[]){
   return{
     excess:[],
     shortages:[],
     actions:[
       "Promote slow stock",
       "Reorder fast-moving vehicles",
     ],
   };
 }
}
