import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { tag?: string; page?: number; limit?: number }) {
    const { tag, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };
    if (tag) {
      where.tags = { has: tag };
    }

    const [items, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.blogPost.count({ where }),
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

  async findBySlug(slug: string) {
    return this.prisma.blogPost.findUnique({
      where: { slug },
    });
  }

  async create(data: any) {
    return this.prisma.blogPost.create({ data });
  }
}
