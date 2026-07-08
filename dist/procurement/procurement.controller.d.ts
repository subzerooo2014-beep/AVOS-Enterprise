import { ProcurementService } from './procurement.service';
import { CreateSupplierDto } from './create-supplier.dto';
import { UpdateSupplierDto } from './update-supplier.dto';
import { CreatePurchaseOrderDto } from './create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './update-purchase-order.dto';
export declare class ProcurementController {
    private readonly procurementService;
    constructor(procurementService: ProcurementService);
    createSupplier(dto: CreateSupplierDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        phone: string | null;
        status: import("@prisma/client").$Enums.SupplierStatus;
        email: string | null;
        updatedAt: Date;
        address: string | null;
    }>;
    findSuppliers(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        phone: string | null;
        status: import("@prisma/client").$Enums.SupplierStatus;
        email: string | null;
        updatedAt: Date;
        address: string | null;
    }[]>;
    findSupplier(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        phone: string | null;
        status: import("@prisma/client").$Enums.SupplierStatus;
        email: string | null;
        updatedAt: Date;
        address: string | null;
    }>;
    updateSupplier(id: string, dto: UpdateSupplierDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        phone: string | null;
        status: import("@prisma/client").$Enums.SupplierStatus;
        email: string | null;
        updatedAt: Date;
        address: string | null;
    }>;
    deleteSupplier(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        phone: string | null;
        status: import("@prisma/client").$Enums.SupplierStatus;
        email: string | null;
        updatedAt: Date;
        address: string | null;
    }>;
    createPurchaseOrder(dto: CreatePurchaseOrderDto): Promise<{
        supplier: {
            id: string;
            createdAt: Date;
            name: string;
            phone: string | null;
            status: import("@prisma/client").$Enums.SupplierStatus;
            email: string | null;
            updatedAt: Date;
            address: string | null;
        };
        items: {
            id: string;
            createdAt: Date;
            total: number;
            itemName: string;
            quantity: number;
            unitPrice: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PurchaseOrderStatus;
        total: number;
        updatedAt: Date;
        supplierId: string;
    }>;
    findPurchaseOrders(): Promise<({
        supplier: {
            id: string;
            createdAt: Date;
            name: string;
            phone: string | null;
            status: import("@prisma/client").$Enums.SupplierStatus;
            email: string | null;
            updatedAt: Date;
            address: string | null;
        };
        items: {
            id: string;
            createdAt: Date;
            total: number;
            itemName: string;
            quantity: number;
            unitPrice: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PurchaseOrderStatus;
        total: number;
        updatedAt: Date;
        supplierId: string;
    })[]>;
    findPurchaseOrder(id: string): Promise<{
        supplier: {
            id: string;
            createdAt: Date;
            name: string;
            phone: string | null;
            status: import("@prisma/client").$Enums.SupplierStatus;
            email: string | null;
            updatedAt: Date;
            address: string | null;
        };
        items: {
            id: string;
            createdAt: Date;
            total: number;
            itemName: string;
            quantity: number;
            unitPrice: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PurchaseOrderStatus;
        total: number;
        updatedAt: Date;
        supplierId: string;
    }>;
    updatePurchaseOrder(id: string, dto: UpdatePurchaseOrderDto): Promise<{
        supplier: {
            id: string;
            createdAt: Date;
            name: string;
            phone: string | null;
            status: import("@prisma/client").$Enums.SupplierStatus;
            email: string | null;
            updatedAt: Date;
            address: string | null;
        };
        items: {
            id: string;
            createdAt: Date;
            total: number;
            itemName: string;
            quantity: number;
            unitPrice: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PurchaseOrderStatus;
        total: number;
        updatedAt: Date;
        supplierId: string;
    }>;
    deletePurchaseOrder(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PurchaseOrderStatus;
        total: number;
        updatedAt: Date;
        supplierId: string;
    }>;
}
