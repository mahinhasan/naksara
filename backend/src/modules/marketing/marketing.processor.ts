import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Processor('marketing')
@Injectable()
export class MarketingProcessor extends WorkerHost {
  private readonly logger = new Logger(MarketingProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'abandoned-cart':
        return this.handleAbandonedCart(job.data);
      case 'send-email':
        return this.handleSendEmail(job.data);
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleAbandonedCart(data: { userId: string; cartItems: any[] }) {
    const { userId, cartItems } = data;
    
    // Check if the user has completed an order since the job was scheduled
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
    if (!user) return;

    this.logger.log(`Sending abandoned cart recovery email to ${user.email}`);
    // Here we would call an EmailService (e.g. AWS SES)
    // For now, we'll log it as a successful simulation
    return { success: true, email: user.email };
  }

  private async handleSendEmail(data: { email: string; subject: string; template: string; context: any }) {
    this.logger.log(`Sending email to ${data.email} with subject "${data.subject}"`);
    // Implementation for SES or other email provider
    return { success: true };
  }
}
