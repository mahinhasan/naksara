import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const userId = req.user?.id || null; // Optional userId for guest checkout
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string, @Req() req) {
    return this.ordersService.findOrderById(id, req.user.id);
  }

  @Get('my/orders')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Req() req) {
    return this.ordersService.findAllUserOrders(req.user.id);
  }
}
