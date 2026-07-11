export declare class PublisherVehicleContextService {
    vehicleId(context: any): string;
    loadVehicle(prisma: any, context: any): Promise<any>;
    title(vehicle: any): string;
    price(vehicle: any, context: any): number | null;
}
