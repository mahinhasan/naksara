import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getRevenueStats(): Promise<{
        totalRevenue: number;
        orderCount: number;
        averageOrderValue: number;
    }>;
    getTopSellingProducts(): Promise<{
        salesCount: number;
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
    }[]>;
    trackEvent(type: string, metadata: any): Promise<{
        id: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        eventType: string;
    }>;
}
