export declare class DistributedLockService {
    private locks;
    acquire(key: string): boolean;
    release(key: string): boolean;
}
