import { Injectable } from "@nestjs/common";
import { EmiratesIdPolicy } from "../policies/emirates-id.policy";
@Injectable()
export class EmiratesIdProvider {
  constructor(private readonly policy: EmiratesIdPolicy) {}
  verify(emiratesId: string, dateOfBirth: string) {
    this.policy.validate(emiratesId);
    return {
      verified: true,
      emiratesIdMasked: `***-****-${emiratesId.slice(-7)}`,
      dateOfBirth,
      simulated: true,
    };
  }
}
