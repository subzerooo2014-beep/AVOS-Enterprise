import { Injectable } from "@nestjs/common";

@Injectable()
export class ApprovalEngine {
  approve(input: any) {
    return {
      approved: true,
      approvedAt: new Date().toISOString(),
      input,
    };
  }
}
