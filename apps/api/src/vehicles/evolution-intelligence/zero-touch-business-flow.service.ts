import { Injectable } from "@nestjs/common";

@Injectable()
export class ZeroTouchBusinessFlowService {
  orchestrate(input: {
    verified: boolean;
    approved: boolean;
    funded: boolean;
    insured: boolean;
    logisticsReady: boolean;
  }) {
    const ready = Object.values(input).every(Boolean);

    return {
      ready,
      actions: ready
        ? ["execute-sale", "transfer-ownership", "schedule-delivery"]
        : ["resolve-pending-requirements"],
    };
  }
}
