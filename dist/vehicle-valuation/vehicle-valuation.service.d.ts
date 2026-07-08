import { ValuateVehicleDto } from "./dto/valuate-vehicle.dto";
export declare class VehicleValuationService {
    valuate(dto: ValuateVehicleDto): {
        make: string;
        model: string;
        year: number;
        estimatedValue: number;
        confidence: string;
        factors: {
            age: number;
            agePenalty: number;
            mileagePenalty: number;
            conditionFactor: number;
            demandFactor: number;
        };
    };
}
