import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // --- Dashboard Statistics ---
  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, totalRevenue, totalUsers, dailyOrders] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      this.prisma.user.count({ 
        where: { role: { name: 'CUSTOMER' } } 
      }),
      this.prisma.order.count({
        where: { createdAt: { gte: today } },
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalUsers,
      dailyOrders,
    };
  }

  // --- Order Management ---
  async getOrders(query: { page?: number; limit?: number; status?: OrderStatus }) {
    const { page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, firstName: true, lastName: true } } },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  // --- User & Employee Management ---
  async getUsers(query: { page?: number; limit?: number; role?: string }) {
    const { page = 1, limit = 20, role } = query;
    const skip = (page - 1) * limit;

    const where = role ? { role: { name: role } } : {};

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: { select: { id: true, name: true } },
          isActive: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateUserRole(userId: string, roleId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { roleId },
    });
  }

  async toggleUserStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });
  }

  // --- Role & Permission Management ---
  async getRoles() {
    return this.prisma.role.findMany({
      include: { permissions: { include: { permission: true } } }
    });
  }

  async createRole(data: { name: string, description?: string, permissions: string[] }) {
    // Check if permissions are passed as IDs or names
    // For now assume IDs. If they are names, we need to resolve them.
    return this.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: {
          create: data.permissions.map(permissionId => ({
            permissionId
          }))
        }
      },
      include: { permissions: { include: { permission: true } } }
    });
  }

  async updateRole(id: string, data: { name?: string, description?: string, permissions?: string[] }) {
    if (data.permissions) {
      await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        permissions: data.permissions ? {
          create: data.permissions.map(permissionId => ({
            permissionId
          }))
        } : undefined
      }
    });
  }

  async getAllPermissions() {
    return this.prisma.permission.findMany();
  }

  // --- Catalog Management ---
  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryId: string;
    images?: string[];
  }) {
    const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const sku = `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return this.prisma.product.create({
      data: {
        name: data.name,
        slug,
        sku,
        description: data.description,
        price: data.price,
        stockQuantity: data.stockQuantity,
        categoryId: data.categoryId,
        isActive: true,
        images: data.images ? {
          create: data.images.map(url => ({ url }))
        } : undefined
      },
      include: { images: true, category: true }
    });
  }

  async createCategory(data: { name: string; description?: string; parentId?: string }) {
    const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    return this.prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        parentId: data.parentId
      }
    });
  }

  async updateStock(productId: string, quantity: number) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: quantity },
    });
  }
}
