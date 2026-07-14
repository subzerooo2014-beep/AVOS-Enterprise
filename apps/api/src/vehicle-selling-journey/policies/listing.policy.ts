import { Injectable } from "@nestjs/common";
@Injectable()
export class ListingPolicy {
  validate(title: string, description: string, askingPrice: number) {
    if (title.trim().length < 5) throw new Error("Title too short");
    if (description.trim().length < 20) throw new Error("Description too short");
    if (askingPrice <= 0) throw new Error("Invalid asking price");
    return true;
  }
}
