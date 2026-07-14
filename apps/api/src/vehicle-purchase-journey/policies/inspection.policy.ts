import { Injectable } from "@nestjs/common";
@Injectable()
export class InspectionPolicy {
  validate(centerId: string, preferredDate: string) {
    if (!centerId || !preferredDate) throw new Error("Inspection details required");
    return true;
  }
}
