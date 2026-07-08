export declare function buildDashboard(stats: {
    totalSales: number;
    openSales: number;
    draftSales: number;
    pendingSales: number;
    approvedSales: number;
    wonSales: number;
    lostSales: number;
    cancelledSales: number;
    closedSales: number;
}): {
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
