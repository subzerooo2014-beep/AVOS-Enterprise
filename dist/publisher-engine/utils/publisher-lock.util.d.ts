export declare class PublisherLockUtil {
    static expired(lockedAt?: Date | string | null, timeoutMinutes?: number): boolean;
    static token(jobId: string): string;
}
