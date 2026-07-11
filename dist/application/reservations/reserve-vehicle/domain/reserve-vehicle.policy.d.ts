export declare class ReserveVehiclePolicy {
    ensureInventoryAvailable(inventory: {
        status: string;
        reserved: boolean;
    }): void;
    createExpiryDate(): Date;
}
