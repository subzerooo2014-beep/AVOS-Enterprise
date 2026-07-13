import { Injectable } from "@nestjs/common";

@Injectable()
export class RuntimeCoordinator {
  coordinate() {
    return {
      success: true,
      coordinatorId: `runtime-${Date.now()}`,
      status: "RUNNING",
    };
  }
}
