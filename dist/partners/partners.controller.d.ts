import { PartnersService } from "./partners.service";
export declare class PartnersController {
    private service;
    constructor(service: PartnersService);
    create(body: any): any;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id: string, body: any): Promise<any>;
}
