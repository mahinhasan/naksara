import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatalogModule } from './modules/catalog/catalog.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { BlogModule } from './modules/blog/blog.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { AdminModule } from './modules/admin/admin.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerMiddleware } from './common/interceptors/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    RedisModule,
    AuthModule,
    CatalogModule,
    OrdersModule,
    BlogModule,
    MarketingModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
