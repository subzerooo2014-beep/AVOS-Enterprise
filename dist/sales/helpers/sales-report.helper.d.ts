export declare function buildSalesReport(stats: any, sales: any[]): {
    dashboard: {
        activeSales: number;
        winRate: number;
        lossRate: number;
        cancelRate: number;
        closeRate: number;
        totalSales: number;
        openSales: number;
        draftSales: number;
        pendingSales: number;
        approvedSales: number;
        wonSales: number;
        lostSales: number;
        cancelledSales: number;
        closedSales: number;
    };
    totalRevenue: number;
    totalRecords: number;
    generatedAt: string;
};
