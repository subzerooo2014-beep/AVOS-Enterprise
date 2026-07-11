import { OnModuleInit } from "@nestjs/common";
import { PersistentAuditLedgerService } from "./persistent-audit-ledger.service";
export declare class V5AuditPersistenceBridgeService implements OnModuleInit {
    private readonly ledger;
    constructor(ledger: PersistentAuditLedgerService);
    onModuleInit(): Promise<void>;
}
