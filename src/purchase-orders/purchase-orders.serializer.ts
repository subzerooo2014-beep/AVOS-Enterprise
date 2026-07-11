import { Injectable } from "@nestjs/common";

@Injectable()
export class PurchaseOrdersSerializer {

 serialize(item:any){
  return item;
 }

 serializeMany(items:any[]){
  return items.map(x=>this.serialize(x));
 }

}
