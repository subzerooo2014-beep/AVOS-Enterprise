export declare class PublisherJobLockService {
    private readonly locks;
    lock(id: string): boolean;
    unlock(id: string): void;
    locked(id: string): boolean;
}
