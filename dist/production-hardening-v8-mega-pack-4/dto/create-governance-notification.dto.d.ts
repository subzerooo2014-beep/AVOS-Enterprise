import { GovernanceNotificationChannel } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class GovernanceNotificationRecipientDto {
    id?: string;
    name?: string;
    address: string;
    channel: GovernanceNotificationChannel;
    roles: string[];
}
export declare class CreateGovernanceNotificationDto {
    channel: GovernanceNotificationChannel;
    subject: string;
    message: string;
    recipients: GovernanceNotificationRecipientDto[];
    escalationId?: string;
    governanceRequestId?: string;
    decisionRecordId?: string;
    changeExecutionId?: string;
    scheduleRunId?: string;
    priority: number;
    deduplicationKey?: string;
    payload?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
