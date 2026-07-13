import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class CoreFlowPolicyService {
  validateCreate(dto: any) {
    if (!dto?.flow) throw new BadRequestException("flow is required.");
    if (!dto?.aggregateType) throw new BadRequestException("aggregateType is required.");
    if (!dto?.aggregateId) throw new BadRequestException("aggregateId is required.");
    return true;
  }

  resolvePriority(dto: any) {
    const priority = Number(dto?.priority ?? 50);
    if (!Number.isFinite(priority) || priority < 1 || priority > 100) {
      throw new BadRequestException("priority must be between 1 and 100.");
    }
    return priority;
  }

  resolveMaxAttempts(dto: any) {
    const maxAttempts = Number(dto?.maxAttempts ?? 3);
    if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10) {
      throw new BadRequestException("maxAttempts must be between 1 and 10.");
    }
    return maxAttempts;
  }

  canRetry(status: string) {
    return ["failed", "dead-lettered"].includes(status);
  }

  canCompensate(status: string) {
    return ["completed", "failed", "dead-lettered"].includes(status);
  }
}
