import { RuntimeEnvironment } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";
export declare class CaptureRuntimeBaselineDto {
    key: string;
    name: string;
    environment: RuntimeEnvironment;
    namespace: string;
    configurationIds?: string[];
    signalSnapshot?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    actor: RuntimeActorDto;
}
