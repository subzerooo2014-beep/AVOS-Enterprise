import { BadRequestException, NotFoundException } from "@nestjs/common";
export declare class VehicleNotFoundException extends NotFoundException {
    constructor();
}
export declare class InventoryNotFoundException extends NotFoundException {
    constructor();
}
export declare class VehicleNotAvailableException extends BadRequestException {
    constructor();
}
