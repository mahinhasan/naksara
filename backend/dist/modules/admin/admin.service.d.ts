import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        totalUsers: number;
        dailyOrders: number;
    }>;
    getOrders(query: {
        page?: number;
        limit?: number;
        status?: OrderStatus;
    }): Promise<{
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
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<{
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
    getUsers(query: {
        page?: number;
        limit?: number;
        role?: string;
    }): Promise<{
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
    updateUserRole(userId: string, roleId: string): Promise<{
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
    toggleUserStatus(userId: string): Promise<{
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
    getAllPermissions(): Promise<{
        description: string | null;
        id: string;
        action: string;
        subject: string;
    }[]>;
    createProduct(data: {
        name: string;
        description: string;
        price: number;
        stockQuantity: number;
        categoryId: string;
        images?: string[];
    }): Promise<{
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
    createCategory(data: {
        name: string;
        description?: string;
        parentId?: string;
    }): Promise<{
        description: string | null;
        name: string;
        id: string;
        slug: string;
        imageUrl: string | null;
        parentId: string | null;
    }>;
    updateStock(productId: string, quantity: number): Promise<{
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
}
