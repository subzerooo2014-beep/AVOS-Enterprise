import { Injectable } from "@nestjs/common";

@Injectable()
export class SagaCoordinator {
  startSaga(input: any) {
    return {
      sagaId: `saga-${Date.now()}`,
      status: "STARTED",
      input,
    };
  }
}
