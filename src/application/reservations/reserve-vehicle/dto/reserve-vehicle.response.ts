export interface ReserveVehicleResponse {
  reservationId: string;
  inventoryId: string;
  vehicleId: string;
  customerId: string;
  status: string;
  expiresAt: Date | null;
}
