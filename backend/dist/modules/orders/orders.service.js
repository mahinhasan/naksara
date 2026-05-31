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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(userId, data) {
        const productIds = data.items.map(i => i.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, isActive: true },
        });
        if (products.length !== data.items.length) {
            throw new common_1.BadRequestException('Some products are unavailable');
        }
        let subtotal = 0;
        const orderItems = data.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (product.stockQuantity < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${product.name}`);
            }
            subtotal += Number(product.price) * item.quantity;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            };
        });
        let discount = 0;
        if (data.couponCode) {
            const coupon = await this.prisma.coupon.findUnique({
                where: { code: data.couponCode, isActive: true },
            });
            if (coupon && coupon.endDate > new Date()) {
                discount = coupon.isPercent ? (subtotal * Number(coupon.discount)) / 100 : Number(coupon.discount);
            }
        }
        const shippingAmount = 0;
        const taxAmount = (subtotal - discount) * 0.1;
        const totalAmount = subtotal - discount + shippingAmount + taxAmount;
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    orderNumber: `ORD-${Date.now()}`,
                    userId,
                    status: 'PENDING',
                    totalAmount,
                    taxAmount,
                    shippingAmount,
                    discountAmount: discount,
                    couponCode: data.couponCode,
                    shippingAddress: data.shippingAddress,
                    billingAddress: data.billingAddress,
                    items: {
                        create: orderItems,
                    },
                },
                include: { items: true },
            });
            for (const item of data.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stockQuantity: { decrement: item.quantity } },
                });
            }
            if (userId) {
                const points = Math.floor(totalAmount);
                await tx.user.update({
                    where: { id: userId },
                    data: { loyaltyPoints: { increment: points } },
                });
                await tx.loyaltyLog.create({
                    data: { userId, points, reason: 'PURCHASE' },
                });
            }
            return order;
        });
    }
    async findOrderById(id, userId) {
        const where = { id };
        if (userId)
            where.userId = userId;
        return this.prisma.order.findFirst({
            where,
            include: { items: { include: { product: true } }, payments: true },
        });
    }
    async findAllUserOrders(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { items: true },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map