import { Injectable } from "@nestjs/common";
@Injectable()
export class LearningPolicy {
  validate(score: number) {
    if (score < 0 || score > 100) throw new Error("Learning score must be between 0 and 100");
    return true;
  }
}
