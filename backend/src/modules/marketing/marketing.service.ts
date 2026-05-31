import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MarketingService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('marketing') private marketingQueue: Queue,
  ) {}

  async validateCoupon(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code, isActive: true },
    });

    if (!coupon) return null;
    if (coupon.endDate < new Date()) return null;
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return null;

    return coupon;
  }

  async incrementCouponUsage(code: string) {
    return this.prisma.coupon.update({
      where: { code },
      data: { usageCount: { increment: 1 } },
    });
  }

  async scheduleAbandonedCartRecovery(userId: string, cartItems: any[]) {
    // Schedule a job to run in 24 hours if the cart is still active
    await this.marketingQueue.add(
      'abandoned-cart',
      { userId, cartItems },
      { delay: 24 * 60 * 60 * 1000, jobId: `abandoned-cart-${userId}` },
    );
  }

  async sendMarketingEmail(email: string, subject: string, template: string, context: any) {
    await this.marketingQueue.add('send-email', {
      email,
      subject,
      template,
      context,
    });
  }
}
