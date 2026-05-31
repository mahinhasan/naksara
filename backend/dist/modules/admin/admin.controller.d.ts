import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        totalOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        totalUsers: number;
        dailyOrders: number;
    }>;
    getOrders(page?: number, limit?: number, status?: string): Promise<{
        items: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            shippingAmount: import("@prisma/client/runtime/library").Decimal;
            discountAmount: import("@prisma/client/runtime/library").Decimal;
            couponCode: string | null;
            shippingAddress: import("@prisma/client/runtime/library").JsonValue;
            billingAddress: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateOrderStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        taxAmount: import("@prisma/client/runtime/library").Decimal;
        shippingAmount: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        couponCode: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        billingAddress: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getUsers(page?: number, limit?: number, role?: string): Promise<{
        items: {
            role: {
                name: string;
                id: string;
            };
            id: string;
            isActive: boolean;
            createdAt: Date;
            email: string;
            firstName: string;
            lastName: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateUserRole(id: string, roleId: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        firstName: string | null;
        lastName: string | null;
        roleId: string;
        loyaltyPoints: number;
        referralCode: string;
        referredById: string | null;
    }>;
    toggleUserStatus(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        firstName: string | null;
        lastName: string | null;
        roleId: string;
        loyaltyPoints: number;
        referralCode: string;
        referredById: string | null;
    }>;
    createProduct(data: any): Promise<{
        category: {
            description: string | null;
            name: string;
            id: string;
            slug: string;
            imageUrl: string | null;
            parentId: string | null;
        };
        images: {
            order: number;
            id: string;
            productId: string;
            url: string;
            isMain: boolean;
            altText: string | null;
        }[];
    } & {
        categoryId: string;
        description: string;
        name: string;
        id: string;
        slug: string;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        compareAtPrice: import("@prisma/client/runtime/library").Decimal | null;
        stockQuantity: number;
        isActive: boolean;
        isFeatured: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createCategory(data: any): Promise<{
        description: string | null;
        name: string;
        id: string;
        slug: string;
        imageUrl: string | null;
        parentId: string | null;
    }>;
    updateStock(id: string, quantity: number): Promise<{
        categoryId: string;
        description: string;
        name: string;
        id: string;
        slug: string;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        compareAtPrice: import("@prisma/client/runtime/library").Decimal | null;
        stockQuantity: number;
        isActive: boolean;
        isFeatured: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getRoles(): Promise<({
        permissions: ({
            permission: {
                description: string | null;
                id: string;
                action: string;
                subject: string;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createRole(data: {
        name: string;
        description?: string;
        permissions: string[];
    }): Promise<{
        permissions: ({
            permission: {
                description: string | null;
                id: string;
                action: string;
                subject: string;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRole(id: string, data: {
        name?: string;
        description?: string;
        permissions?: string[];
    }): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPermissions(): Promise<{
        description: string | null;
        id: string;
        action: string;
        subject: string;
    }[]>;
}
