import { PublisherLockManagerService } from "./publisher-lock-manager.service";
export declare class PublisherWatchdogService {
    private readonly lockManager;
    constructor(lockManager: PublisherLockManagerService);
    run(): Promise<{
        success: boolean;
        released: {
            success: boolean;
            released: number;
        };
        checkedAt: Date;
    }>;
}
