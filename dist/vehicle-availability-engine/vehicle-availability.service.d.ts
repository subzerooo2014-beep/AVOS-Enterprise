export declare class VehicleAvailabilityService {
    isAvailable(status: string): status is "AVAILABLE";
    canReserve(status: string): status is "AVAILABLE";
    canSell(status: string): status is "AVAILABLE" | "RESERVED";
}
