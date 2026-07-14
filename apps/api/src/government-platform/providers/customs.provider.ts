import { Injectable } from "@nestjs/common";
import { CustomsExportPolicy } from "../policies/customs-export.policy";
@Injectable()
export class CustomsProvider {
  constructor(private readonly policy: CustomsExportPolicy) {}
  createCase(input: {
    vehicleId: string;
    destinationCountry: string;
    declaredValue: number;
    port: string;
  }) {
    this.policy.validate(input);
    return {
      caseReference: `customs_${Date.now()}`,
      ...input,
      status: "SUBMITTED",
      simulated: true,
    };
  }
  status(caseReference: string) {
    return {
      caseReference,
      status: "UNDER_REVIEW",
      simulated: true,
    };
  }
}
