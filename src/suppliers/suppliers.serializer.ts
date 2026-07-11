import { Injectable } from "@nestjs/common";

@Injectable()
export class SuppliersSerializer {
  serialize(item: any) {
    return item;
  }

  serializeMany(items: any[]) {
    return items.map((item) => this.serialize(item));
  }
}
