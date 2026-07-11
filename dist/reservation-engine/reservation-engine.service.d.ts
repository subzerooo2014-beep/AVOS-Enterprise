export declare class ReservationEngineService {
    createReservation(vehicleId: string, customerId: string): {
        reservationId: `${string}-${string}-${string}-${string}-${string}`;
        vehicleId: string;
        customerId: string;
        status: string;
        expiresAt: Date;
    };
    isExpired(expireDate: Date): boolean;
}
