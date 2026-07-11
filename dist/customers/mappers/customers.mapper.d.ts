export declare class CustomersMapper {
    static toResponse(entity: any): {
        id: any;
        name: any;
        email: any;
        phone: any;
        company: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null;
    static toResponseList(items?: any[]): ({
        id: any;
        name: any;
        email: any;
        phone: any;
        company: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null)[];
    static toCreate(data: any): {
        name: any;
        email: any;
        phone: any;
        company: any;
        status: any;
    };
    static toUpdate(data: any): {
        name: any;
        email: any;
        phone: any;
        company: any;
        status: any;
    };
}
