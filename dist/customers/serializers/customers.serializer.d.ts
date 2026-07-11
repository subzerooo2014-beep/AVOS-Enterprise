export declare class CustomersSerializer {
    static serialize(data: any): {
        id: any;
        name: any;
        email: any;
        phone: any;
        company: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null;
    static serializeMany(items?: any[]): ({
        id: any;
        name: any;
        email: any;
        phone: any;
        company: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null)[];
    static serializePagination(result: any): {
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
    };
}
