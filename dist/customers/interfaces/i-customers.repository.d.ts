export interface ICustomersRepository {
    findCustomers(where?: any): Promise<any[]>;
    paginateCustomers(page: number, limit: number, where?: any): Promise<any>;
    findCustomerById(id: string): Promise<any>;
    createCustomer(data: any): Promise<any>;
    updateCustomer(id: string, data: any): Promise<any>;
    deleteCustomer(id: string): Promise<any>;
    countCustomers(where?: any): Promise<number>;
}
