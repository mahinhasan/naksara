import { Module } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { MarketingProcessor } from './marketing.processor';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'marketing',
    }),
  ],
  providers: [MarketingService, MarketingProcessor, PrismaService],
  exports: [MarketingService],
})
export class MarketingModule {}
