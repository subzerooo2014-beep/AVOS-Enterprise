import { CustomersRepository } from "./repositories/customers.repository";
export declare class CustomersService {
    private readonly customersRepository;
    constructor(customersRepository: CustomersRepository);
    findAll(): Promise<({
        id: any;
        name: any;
        email: any;
        phone: any;
        company: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null)[]>;
    paginate(page?: number, limit?: number, where?: any): Promise<{
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
