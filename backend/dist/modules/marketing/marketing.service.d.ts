import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Queue } from 'bullmq';
export declare class MarketingService {
    private prisma;
    private marketingQueue;
    constructor(prisma: PrismaService, marketingQueue: Queue);
    validateCoupon(code: string): Promise<{
        id: string;
        isActive: boolean;
        code: string;
        discount: import("@prisma/client/runtime/library").Decimal;
        isPercent: boolean;
        startDate: Date;
        endDate: Date;
        usageLimit: number | null;
        usageCount: number;
    }>;
    incrementCouponUsage(code: string): Promise<{
        id: string;
        isActive: boolean;
        code: string;
        discount: import("@prisma/client/runtime/library").Decimal;
        isPercent: boolean;
        startDate: Date;
        endDate: Date;
        usageLimit: number | null;
        usageCount: number;
    }>;
    scheduleAbandonedCartRecovery(userId: string, cartItems: any[]): Promise<void>;
    sendMarketingEmail(email: string, subject: string, template: string, context: any): Promise<void>;
}
