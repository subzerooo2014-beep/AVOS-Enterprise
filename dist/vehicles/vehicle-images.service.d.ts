export declare class VehicleImagesService {
    private readonly storage;
    list(vehicleId: string): string[];
    add(vehicleId: string, url: string): string[];
    remove(vehicleId: string, url: string): string[];
}
