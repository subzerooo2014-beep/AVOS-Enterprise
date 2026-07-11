import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './create-supplier.dto';
import { UpdateSupplierDto } from './update-supplier.dto';
import { CreatePurchaseOrderDto } from './create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './update-purchase-order.dto';
export declare class ProcurementService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSupplier(dto: CreateSupplierDto): Promise<{
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.SupplierStatus;
        createdAt: Date;
        phone: string | null;
        email: string | null;
        updatedAt: Date;
        address: string | null;
    }>;
    findSuppliers(): Promise<{
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.SupplierStatus;
        createdAt: Date;
        phone: string | null;
        email: string | null;
        updatedAt: Date;
        address: string | null;
    }[]>;
    findSupplier(id: string): Promise<{
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.SupplierStatus;
        createdAt: Date;
        phone: string | null;
        email: string | null;
        updatedAt: Date;
        address: string | null;
    }>;
    updateSupplier(id: string, dto: UpdateSupplierDto): Promise<{
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.SupplierStatus;
        createdAt: Date;
        phone: string | null;
        email: string | null;
        updatedAt: Date;
        address: string | null;
    }>;
    deleteSupplier(id: string): Promise<{
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.SupplierStatus;
        createdAt: Date;
        phone: string | null;
        email: string | null;
        updatedAt: Date;
        address: string | null;
    }>;
    createPurchaseOrder(dto: CreatePurchaseOrderDto): Promise<{
        supplier: {
            id: string;
            name: string;
            status: import("@prisma/client").$Enums.SupplierStatus;
            createdAt: Date;
            phone: string | null;
            email: string | null;
            updatedAt: Date;
            address: string | null;
        };
        items: {
            id: string;
            total: number;
            createdAt: Date;
            quantity: number;
            itemName: string;
            unitPrice: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.PurchaseOrderStatus;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
    }>;
    findPurchaseOrders(): Promise<({
        supplier: {
            id: string;
            name: string;
            status: import("@prisma/client").$Enums.SupplierStatus;
            createdAt: Date;
            phone: string | null;
            email: string | null;
            updatedAt: Date;
            address: string | null;
        };
        items: {
            id: string;
            total: number;
            createdAt: Date;
            quantity: number;
            itemName: string;
            unitPrice: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.PurchaseOrderStatus;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
    })[]>;
    findPurchaseOrder(id: string): Promise<{
        supplier: {
            id: string;
            name: string;
            status: import("@prisma/client").$Enums.SupplierStatus;
            createdAt: Date;
            phone: string | null;
            email: string | null;
            updatedAt: Date;
            address: string | null;
        };
        items: {
            id: string;
            total: number;
            createdAt: Date;
            quantity: number;
            itemName: string;
            unitPrice: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.PurchaseOrderStatus;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
    }>;
    updatePurchaseOrder(id: string, dto: UpdatePurchaseOrderDto): Promise<{
        supplier: {
            id: string;
            name: string;
            status: import("@prisma/client").$Enums.SupplierStatus;
            createdAt: Date;
            phone: string | null;
            email: string | null;
            updatedAt: Date;
            address: string | null;
        };
        items: {
            id: string;
            total: number;
            createdAt: Date;
            quantity: number;
            itemName: string;
            unitPrice: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.PurchaseOrderStatus;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
    }>;
    deletePurchaseOrder(id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.PurchaseOrderStatus;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
    }>;
}
