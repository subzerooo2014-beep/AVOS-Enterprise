import { Injectable } from "@nestjs/common";
@Injectable()
export class ReviewPolicy {
  validate(score: number) {
    if (score < 1 || score > 5) throw new Error("Review score must be between 1 and 5");
    return true;
  }
}
