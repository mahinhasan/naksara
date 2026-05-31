import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getRevenueStats() {
    const orders = await this.prisma.order.findMany({
      where: { status: 'PAID' },
      select: { totalAmount: true, createdAt: true },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const orderCount = orders.length;

    return {
      totalRevenue,
      orderCount,
      averageOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
    };
  }

  async getTopSellingProducts() {
    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const productDetails = await this.prisma.product.findMany({
      where: { id: { in: topProducts.map(p => p.productId) } },
    });

    return topProducts.map(p => ({
      ...productDetails.find(pd => pd.id === p.productId),
      salesCount: p._sum.quantity,
    }));
  }

  async trackEvent(type: string, metadata: any) {
    return this.prisma.analyticsEvent.create({
      data: { eventType: type, metadata },
    });
  }
}
