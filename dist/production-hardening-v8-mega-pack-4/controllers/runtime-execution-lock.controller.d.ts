import { AcquireRuntimeLockDto, ReleaseRuntimeLockDto } from "../dto";
import { RuntimeExecutionLockService } from "../services";
export declare class RuntimeExecutionLockController {
    private readonly locks;
    constructor(locks: RuntimeExecutionLockService);
    acquire(dto: AcquireRuntimeLockDto): import("..").RuntimeExecutionLock;
    list(): import("..").RuntimeExecutionLock[];
    get(id: string): import("..").RuntimeExecutionLock;
    release(id: string, dto: ReleaseRuntimeLockDto): import("..").RuntimeExecutionLock;
    forceRelease(id: string, dto: ReleaseRuntimeLockDto): import("..").RuntimeExecutionLock;
}
