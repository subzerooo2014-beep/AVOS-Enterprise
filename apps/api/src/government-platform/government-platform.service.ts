import { Injectable } from "@nestjs/common";
import { UaePassProvider } from "./providers/uae-pass.provider";
import { EmiratesIdProvider } from "./providers/emirates-id.provider";
import { RtaProvider } from "./providers/rta.provider";
import { MoiProvider } from "./providers/moi.provider";
import { SalikProvider } from "./providers/salik.provider";
import { EvgProvider } from "./providers/evg.provider";
import { CustomsProvider } from "./providers/customs.provider";
import { OwnershipTransferProvider } from "./providers/ownership-transfer.provider";
import { GovernmentAuditService } from "./services/government-audit.service";

@Injectable()
export class GovernmentPlatformService {
  constructor(
    readonly uaePass: UaePassProvider,
    readonly emiratesId: EmiratesIdProvider,
    readonly rta: RtaProvider,
    readonly moi: MoiProvider,
    readonly salik: SalikProvider,
    readonly evg: EvgProvider,
    readonly customs: CustomsProvider,
    readonly ownershipTransfer: OwnershipTransferProvider,
    private readonly audit: GovernmentAuditService,
  ) {}

  record(
    action: string,
    provider: string,
    entityId: string,
    metadata: Record<string, unknown> = {},
  ) {
    return this.audit.record(action, provider, entityId, metadata);
  }
}
