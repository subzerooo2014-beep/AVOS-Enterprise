import { Injectable } from "@nestjs/common";

@Injectable()
export class InventoryTransactionsPolicy {

  canCreate(){
    return true;
  }

  canRead(){
    return true;
  }

}
