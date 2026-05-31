"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let CatalogService = class CatalogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllProducts(query) {
        const { categoryId, minPrice, maxPrice, search, sortBy, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (categoryId)
            where.categoryId = categoryId;
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = minPrice;
            if (maxPrice)
                where.price.lte = maxPrice;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const orderBy = {};
        if (sortBy) {
            const [field, direction] = sortBy.split(':');
            orderBy[field] = direction;
        }
        else {
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
    async findProductBySlug(slug) {
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
    async getPersonalizedRecommendations(userId) {
        if (userId) {
            const userOrders = await this.prisma.order.findMany({
                where: { userId },
                include: { items: true },
                take: 3,
                orderBy: { createdAt: 'desc' },
            });
            if (userOrders.length > 0) {
                const lastCategoryIds = userOrders.flatMap(o => o.items.map(i => i.productId));
                const recommendations = await this.prisma.product.findMany({
                    where: {
                        isActive: true,
                        id: { notIn: lastCategoryIds },
                        categoryId: { in: Array.from(new Set(userOrders.flatMap(o => o.items.map(async (i) => {
                                const p = await this.prisma.product.findUnique({ where: { id: i.productId } });
                                return p.categoryId;
                            })))) }
                    },
                    take: 4,
                    include: { images: true, category: true },
                });
                if (recommendations.length > 0)
                    return recommendations;
            }
        }
        return this.prisma.product.findMany({
            where: { isFeatured: true, isActive: true },
            take: 4,
            include: { images: true, category: true },
        });
    }
    async getRelatedProducts(productId) {
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
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map