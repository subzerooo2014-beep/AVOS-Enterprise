import { Injectable } from "@nestjs/common";

@Injectable()
export class SalesOrdersSerializer {

 serialize(item:any){
  return item;
 }

 serializeMany(items:any[]){
  return items.map(item=>this.serialize(item));
 }

}
