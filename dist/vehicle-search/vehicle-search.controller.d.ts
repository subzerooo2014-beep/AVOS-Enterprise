import { VehicleSearchService } from "./vehicle-search.service";
import { VehicleSearchDto } from "./dto/vehicle-search.dto";
export declare class VehicleSearchController {
    private service;
    constructor(service: VehicleSearchService);
    search(dto: VehicleSearchDto): any;
}
