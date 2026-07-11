export interface SupplierEntity {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
