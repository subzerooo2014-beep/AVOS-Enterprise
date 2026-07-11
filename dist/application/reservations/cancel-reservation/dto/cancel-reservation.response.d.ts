export interface CancelReservationResponse {
    reservationId: string;
    inventoryId: string;
    vehicleId: string;
    status: string;
    cancelledAt: Date;
}
