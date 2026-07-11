import { Injectable } from "@nestjs/common";

@Injectable()
export class PurchaseOrdersPolicy {

 canCreate(){
  return true;
 }

 canRead(){
  return true;
 }

 canUpdate(){
  return true;
 }

}
