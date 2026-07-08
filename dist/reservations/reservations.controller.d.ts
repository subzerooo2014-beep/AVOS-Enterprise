import { ReservationsService } from "./reservations.service";
export declare class ReservationsController {
    private service;
    constructor(service: ReservationsService);
    findAll(): any;
    create(dto: any): any;
}
