import { FeatureflagsService } from "./featureflags.service";
export declare class FeatureflagsController {
    private service;
    constructor(service: FeatureflagsService);
    findAll(): never[];
    create(dto: any): any;
}
