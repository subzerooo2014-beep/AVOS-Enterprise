export declare class ReservationEngine {
    reserve(id: string): {
        vehicleId: string;
        reserved: boolean;
    };
    release(id: string): {
        vehicleId: string;
        reserved: boolean;
    };
}
