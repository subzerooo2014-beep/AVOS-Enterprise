import { VehicleImagesService } from "./vehicle-images.service";
export declare class VehicleImagesController {
    private readonly service;
    constructor(service: VehicleImagesService);
    list(id: string): string[];
    add(id: string, body: {
        url: string;
    }): string[];
    remove(id: string, body: {
        url: string;
    }): string[];
}
