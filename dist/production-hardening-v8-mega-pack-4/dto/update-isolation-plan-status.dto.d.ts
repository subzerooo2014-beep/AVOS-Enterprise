import { IsolationPlanStatus } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class UpdateIsolationPlanStatusDto {
    status: IsolationPlanStatus;
    reason: string;
    actor: GovernanceActorDto;
}
