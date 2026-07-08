import { VisionService } from "./vision.service";
export declare class VisionController {
    private service;
    constructor(service: VisionService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
