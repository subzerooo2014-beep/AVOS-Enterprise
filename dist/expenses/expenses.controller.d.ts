import { ExpensesService } from "./expenses.service";
export declare class ExpensesController {
    private service;
    constructor(service: ExpensesService);
    findAll(): any;
    create(dto: any): any;
}
