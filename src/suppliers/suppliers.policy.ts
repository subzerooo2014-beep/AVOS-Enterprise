import { Injectable } from "@nestjs/common";

@Injectable()
export class SuppliersPolicy {
  canCreate() {
    return true;
  }

  canRead() {
    return true;
  }

  canUpdate() {
    return true;
  }

  canDelete() {
    return true;
  }
}
