import { Injectable } from "@nestjs/common";
import { InspectionPolicy } from "../policies/inspection.policy";
@Injectable()
export class JourneyInspectionService {
  constructor(private readonly policy: InspectionPolicy) {}
  book(input: { journeyId: string; centerId: string; preferredDate: string }) {
    this.policy.validate(input.centerId, input.preferredDate);
    return { id: `insp_${Date.now()}`, ...input, status: "BOOKED" };
  }
}
