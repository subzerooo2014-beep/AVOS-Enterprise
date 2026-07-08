export function toSalesExportRows(items: any[]): any[] {
  return (items ?? []).map((sale) => ({
    id: sale.id,
    number: sale.number,
    status: sale.status,
    customerId: sale.customerId,
    vehicleId: sale.vehicleId,
    total: sale.total,
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  }));
}
