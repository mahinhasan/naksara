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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async getOrders(query) {
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
    async updateOrderStatus(orderId, status) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    }
    async getUsers(query) {
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
    async updateUserRole(userId, roleId) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { roleId },
        });
    }
    async toggleUserStatus(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id: userId },
            data: { isActive: !user.isActive },
        });
    }
    async getRoles() {
        return this.prisma.role.findMany({
            include: { permissions: { include: { permission: true } } }
        });
    }
    async createRole(data) {
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
    async updateRole(id, data) {
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
    async createProduct(data) {
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
    async createCategory(data) {
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
    async updateStock(productId, quantity) {
        return this.prisma.product.update({
            where: { id: productId },
            data: { stockQuantity: quantity },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map