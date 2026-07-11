import { CustomersService } from "./customers.service";
export declare class CustomersController {
    private readonly service;
    constructor(service: CustomersService);
    findAll(page?: string, limit?: string): Promise<({
        id: any;
        name: any;
        email: any;
        phone: any;
        company: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null)[]> | Promise<{
        data: ({
            id: any;
            name: any;
            email: any;
            phone: any;
            company: any;
            status: any;
            createdAt: any;
            updatedAt: any;
        } | null)[];
        meta: {
            total: any;
            page: any;
            limit: any;
            totalPages: any;
        };
    }>;
    findOne(id: string): Promise<{
        id: any;
        name: any;
        email: any;
        phone: any;
        company: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null>;
    create(dto: any): Promise<{
        id: any;
        name: any;
        email: any;
        phone: any;
        company: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null>;
    update(id: string, dto: any): Promise<{
        id: any;
        name: any;
        email: any;
        phone: any;
        company: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
