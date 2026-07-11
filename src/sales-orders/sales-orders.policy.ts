import { Injectable } from "@nestjs/common";

@Injectable()
export class SalesOrdersPolicy {

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
