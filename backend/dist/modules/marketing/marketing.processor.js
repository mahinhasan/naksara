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
var MarketingProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let MarketingProcessor = MarketingProcessor_1 = class MarketingProcessor extends bullmq_1.WorkerHost {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.logger = new common_1.Logger(MarketingProcessor_1.name);
    }
    async process(job) {
        switch (job.name) {
            case 'abandoned-cart':
                return this.handleAbandonedCart(job.data);
            case 'send-email':
                return this.handleSendEmail(job.data);
            default:
                this.logger.warn(`Unknown job name: ${job.name}`);
        }
    }
    async handleAbandonedCart(data) {
        const { userId, cartItems } = data;
        const recentOrder = await this.prisma.order.findFirst({
            where: {
                userId,
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
        });
        if (recentOrder) {
            this.logger.log(`Abandoned cart recovery skipped for user ${userId} - order already placed.`);
            return;
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        this.logger.log(`Sending abandoned cart recovery email to ${user.email}`);
        return { success: true, email: user.email };
    }
    async handleSendEmail(data) {
        this.logger.log(`Sending email to ${data.email} with subject "${data.subject}"`);
        return { success: true };
    }
};
exports.MarketingProcessor = MarketingProcessor;
exports.MarketingProcessor = MarketingProcessor = MarketingProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('marketing'),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketingProcessor);
//# sourceMappingURL=marketing.processor.js.map