import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('ADMIN', 'EDITOR', 'EMPLOYEE')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @Permissions('READ:Analytics')
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('orders')
  @Permissions('READ:Order')
  async getOrders(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.adminService.getOrders({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as any,
    });
  }

  @Patch('orders/:id/status')
  @Permissions('UPDATE:Order')
  async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateOrderStatus(id, status as any);
  }

  @Get('users')
  @Permissions('READ:User')
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      role,
    });
  }

  @Patch('users/:id/role')
  @Permissions('UPDATE:User')
  async updateUserRole(@Param('id') id: string, @Body('roleId') roleId: string) {
    return this.adminService.updateUserRole(id, roleId);
  }

  @Patch('users/:id/toggle-status')
  @Permissions('UPDATE:User')
  async toggleUserStatus(@Param('id') id: string) {
    return this.adminService.toggleUserStatus(id);
  }

  @Get('products')
  @Permissions('READ:Product')
  async getProducts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getProducts({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
    });
  }

  @Get('products/:id')
  @Permissions('READ:Product')
  async getProduct(@Param('id') id: string) {
    return this.adminService.getProductById(id);
  }

  @Post('products')
  @Permissions('CREATE:Product')
  async createProduct(@Body() data: any) {
    return this.adminService.createProduct(data);
  }

  @Patch('products/:id')
  @Permissions('UPDATE:Product')
  async updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateProduct(id, data);
  }

  @Delete('products/:id')
  @Permissions('DELETE:Product')
  async deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  @Patch('products/:id/stock')
  @Permissions('UPDATE:Product')
  async updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.adminService.updateStock(id, Number(quantity));
  }

  @Get('categories')
  @Permissions('READ:Product')
  async getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  @Permissions('CREATE:Product')
  async createCategory(@Body() data: any) {
    return this.adminService.createCategory(data);
  }

  @Patch('categories/:id')
  @Permissions('UPDATE:Product')
  async updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateCategory(id, data);
  }

  @Delete('categories/:id')
  @Permissions('DELETE:Product')
  async deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }

  // --- Dynamic Permission Management ---
  @Get('roles')
  @Permissions('READ:User')
  async getRoles() {
    return this.adminService.getRoles();
  }

  @Post('roles')
  @Permissions('CREATE:User')
  async createRole(@Body() data: { name: string, description?: string, permissions: string[] }) {
    return this.adminService.createRole(data);
  }

  @Patch('roles/:id')
  @Permissions('UPDATE:User')
  async updateRole(@Param('id') id: string, @Body() data: { name?: string, description?: string, permissions?: string[] }) {
    return this.adminService.updateRole(id, data);
  }

  @Get('permissions')
  @Permissions('READ:User')
  async getPermissions() {
    return this.adminService.getAllPermissions();
  }
}
