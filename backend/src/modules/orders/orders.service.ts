import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string | null, data: {
    items: { productId: string, quantity: number }[];
    shippingAddress: any;
    billingAddress?: any;
    couponCode?: string;
  }) {
    // 1. Validate items and stock
    const productIds = data.items.map(i => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== data.items.length) {
      throw new BadRequestException('Some products are unavailable');
    }

    // 2. Calculate totals
    let subtotal = 0;
    const orderItems = data.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }
      subtotal += Number(product.price) * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // 3. Handle Coupon (simplified)
    let discount = 0;
    if (data.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: data.couponCode, isActive: true },
      });
      if (coupon && coupon.endDate > new Date()) {
        discount = coupon.isPercent ? (subtotal * Number(coupon.discount)) / 100 : Number(coupon.discount);
      }
    }

    const shippingAmount = 0; // Free shipping for premium brand
    const taxAmount = (subtotal - discount) * 0.1; // 10% tax
    const totalAmount = subtotal - discount + shippingAmount + taxAmount;

    // 4. Create Order and Update Stock in transaction
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

      // Update stock
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      // If user is logged in, add loyalty points
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

  async findOrderById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;
    return this.prisma.order.findFirst({
      where,
      include: { items: { include: { product: true } }, payments: true },
    });
  }

  async findAllUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }
}
