export function buildCustomer360(record: any, sales: any[] = [], vehicles: any[] = [], tasks: any[] = []) {
  return {
    profile: record,
    sales,
    vehicles,
    tasks,
    summary: {
      salesCount: sales.length,
      vehiclesCount: vehicles.length,
      tasksCount: tasks.length,
      totalSalesValue: sales.reduce((sum, item) => sum + Number(item?.total ?? 0), 0),
    },
  };
}
