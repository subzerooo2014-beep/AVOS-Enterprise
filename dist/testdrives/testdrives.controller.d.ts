import { TestdrivesService } from "./testdrives.service";
export declare class TestdrivesController {
    private service;
    constructor(service: TestdrivesService);
    findAll(): any;
    create(dto: any): any;
}
