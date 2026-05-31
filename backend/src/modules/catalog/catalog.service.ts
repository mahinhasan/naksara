import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Product, Category } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async findAllProducts(query: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const { categoryId, minPrice, maxPrice, search, sortBy, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sortBy) {
      const [field, direction] = sortBy.split(':');
      orderBy[field] = direction;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { images: true, category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findProductBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        category: true,
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      include: { children: true },
    });
  }

  async getPersonalizedRecommendations(userId?: string) {
    if (userId) {
      // 1. Get user's last orders
      const userOrders = await this.prisma.order.findMany({
        where: { userId },
        include: { items: true },
        take: 3,
        orderBy: { createdAt: 'desc' },
      });

      if (userOrders.length > 0) {
        const lastCategoryIds = userOrders.flatMap(o => o.items.map(i => i.productId));
        // Find products in same categories but not already bought
        const recommendations = await this.prisma.product.findMany({
          where: {
            isActive: true,
            id: { notIn: lastCategoryIds },
            categoryId: { in: Array.from(new Set(userOrders.flatMap(o => o.items.map(async i => {
              const p = await this.prisma.product.findUnique({ where: { id: i.productId } });
              return p.categoryId;
            })))) as any } // Simplified for this implementation
          },
          take: 4,
          include: { images: true, category: true },
        });

        if (recommendations.length > 0) return recommendations;
      }
    }

    // Fallback: Featured products
    return this.prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: 4,
      include: { images: true, category: true },
    });
  }

  async getRelatedProducts(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    return this.prisma.product.findMany({
      where: { 
        categoryId: product.categoryId,
        id: { not: productId },
        isActive: true 
      },
      take: 4,
      include: { images: true, category: true },
    });
  }
}
