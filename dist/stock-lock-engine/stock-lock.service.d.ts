export declare class StockLockService {
    lock(vehicleId: string): {
        vehicleId: string;
        status: string;
        lockedAt: Date;
    };
    release(vehicleId: string): {
        vehicleId: string;
        status: string;
        releasedAt: Date;
    };
}
