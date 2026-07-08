export function normalizeImportedCrmRow(row: any): any {
  return {
    name: row.name ?? row.Name ?? row.customerName ?? row.CustomerName,
    phone: row.phone ?? row.Phone ?? row.mobile ?? row.Mobile,
    email: row.email ?? row.Email,
    source: row.source ?? row.Source ?? "IMPORT",
    notes: row.notes ?? row.Notes,
  };
}
