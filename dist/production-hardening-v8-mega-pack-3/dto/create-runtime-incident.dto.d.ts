import { RuntimeEnvironment, RuntimeIncidentSeverity, RuntimeRiskLevel } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";
export declare class CreateRuntimeIncidentDto {
    title: string;
    description: string;
    environment: RuntimeEnvironment;
    namespace: string;
    service?: string;
    severity: RuntimeIncidentSeverity;
    riskLevel: RuntimeRiskLevel;
    signalIds?: string[];
    configurationIds?: string[];
    tags?: string[];
    actor: RuntimeActorDto;
}
