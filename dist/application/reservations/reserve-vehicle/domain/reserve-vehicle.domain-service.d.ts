export declare class ReserveVehicleDomainService {
    ensureVehicleExists(vehicle: unknown): void;
    ensureInventoryExists(inventory: unknown): void;
    ensureCanReserve(input: {
        vehicleStatus: string;
        inventoryStatus: string;
        inventoryReserved: boolean;
    }): void;
}
