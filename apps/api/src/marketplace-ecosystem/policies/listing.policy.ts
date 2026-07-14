import { Injectable } from "@nestjs/common";
@Injectable()
export class ListingPolicy {
  validate(title: string, description: string, price: number, stock: number) {
    if (title.trim().length < 3) throw new Error("Listing title too short");
    if (description.trim().length < 10) throw new Error("Listing description too short");
    if (price <= 0) throw new Error("Invalid price");
    if (stock < 0) throw new Error("Invalid stock");
    return true;
  }
}
