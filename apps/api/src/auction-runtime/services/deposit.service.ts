import { Injectable } from "@nestjs/common";
@Injectable()
export class DepositService {
  hold(participantId: string, amount: number) {
    return { id: `deposit_${Date.now()}`, participantId, amount, status: "HELD" };
  }
  release(participantId: string) {
    return { participantId, status: "RELEASED" };
  }
}
