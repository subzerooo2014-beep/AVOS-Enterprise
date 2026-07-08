export declare function buildCustomer360(record: any, sales?: any[], vehicles?: any[], tasks?: any[]): {
    profile: any;
    sales: any[];
    vehicles: any[];
    tasks: any[];
    summary: {
        salesCount: number;
        vehiclesCount: number;
        tasksCount: number;
        totalSalesValue: any;
    };
};
