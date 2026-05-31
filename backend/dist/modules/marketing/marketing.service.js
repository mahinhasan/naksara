"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let MarketingService = class MarketingService {
    constructor(prisma, marketingQueue) {
        this.prisma = prisma;
        this.marketingQueue = marketingQueue;
    }
    async validateCoupon(code) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code, isActive: true },
        });
        if (!coupon)
            return null;
        if (coupon.endDate < new Date())
            return null;
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit)
            return null;
        return coupon;
    }
    async incrementCouponUsage(code) {
        return this.prisma.coupon.update({
            where: { code },
            data: { usageCount: { increment: 1 } },
        });
    }
    async scheduleAbandonedCartRecovery(userId, cartItems) {
        await this.marketingQueue.add('abandoned-cart', { userId, cartItems }, { delay: 24 * 60 * 60 * 1000, jobId: `abandoned-cart-${userId}` });
    }
    async sendMarketingEmail(email, subject, template, context) {
        await this.marketingQueue.add('send-email', {
            email,
            subject,
            template,
            context,
        });
    }
};
exports.MarketingService = MarketingService;
exports.MarketingService = MarketingService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('marketing')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], MarketingService);
//# sourceMappingURL=marketing.service.js.map