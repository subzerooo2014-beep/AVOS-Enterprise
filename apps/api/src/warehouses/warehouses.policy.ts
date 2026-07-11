import { Injectable } from "@nestjs/common";

@Injectable()
export class WarehousesPolicy {
  canRead() {
    return true;
  }

  canWrite() {
    return true;
  }
}
