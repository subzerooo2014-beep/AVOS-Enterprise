import {
  Injectable,
  OnModuleInit,
} from "@nestjs/common";
import { AuditEventType } from "../../platform-hardening-v5/enums/audit-event-type.enum";
import { AuditSeverity } from "../../platform-hardening-v5/enums/audit-severity.enum";
import { PersistentAuditLedgerService } from "./persistent-audit-ledger.service";

@Injectable()
export class V5AuditPersistenceBridgeService
  implements OnModuleInit
{
  constructor(
    private readonly ledger:
      PersistentAuditLedgerService,
  ) {}

  async onModuleInit(): Promise<void> {
    const summary =
      await this.ledger.getSummary();

    if (summary.total > 0) {
      return;
    }

    await this.ledger.append({
      eventType: AuditEventType.SYSTEM,
      severity: AuditSeverity.INFO,
      action:
        "persistent-audit-ledger-initialized",
      message:
        "AVOS persistent database audit ledger was initialized",
      actor: "platform",
      metadata: {
        hardeningVersion: "v6",
        sourceVersion: "v5",
      },
    });
  }
}
