import { RecommendationsService } from "./recommendations.service";
export declare class RecommendationsController {
    private service;
    constructor(service: RecommendationsService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
