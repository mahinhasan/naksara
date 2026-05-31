import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // Middleware for audit logs
    this.$use(async (params, next) => {
      const result = await next(params);
      
      // We only log write operations
      if (['create', 'update', 'delete', 'updateMany', 'deleteMany'].includes(params.action)) {
        // In a real app, we would get the userId from a RequestContext/AsyncLocalStorage
        // For now we log that a change happened
        console.log(`[Audit Log] ${params.model}.${params.action} at ${new Date().toISOString()}`);
        
        // Optionally write to the AuditLog table in the DB
        /*
        await this.auditLog.create({
          data: {
            action: params.action,
            model: params.model,
            payload: JSON.stringify(params.args),
            timestamp: new Date(),
          }
        });
        */
      }
      return result;
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
