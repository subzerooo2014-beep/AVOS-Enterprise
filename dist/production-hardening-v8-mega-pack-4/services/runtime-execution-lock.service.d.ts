import { RuntimeExecutionLock } from "../contracts";
import { AcquireRuntimeLockDto, ReleaseRuntimeLockDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
export declare class RuntimeExecutionLockService {
    private readonly store;
    constructor(store: RuntimeGovernanceStore);
    acquire(dto: AcquireRuntimeLockDto): RuntimeExecutionLock;
    release(id: string, dto: ReleaseRuntimeLockDto): RuntimeExecutionLock;
    forceRelease(id: string, dto: ReleaseRuntimeLockDto): RuntimeExecutionLock;
    list(): RuntimeExecutionLock[];
    get(id: string): RuntimeExecutionLock;
    private expireLocks;
}
