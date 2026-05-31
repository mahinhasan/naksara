import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class CatalogService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllProducts(query: {
        categoryId?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
        sortBy?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: ({
            category: {
                description: string | null;
                name: string;
                id: string;
                slug: string;
                imageUrl: string | null;
                parentId: string | null;
            };
            images: {
                order: number;
                id: string;
                productId: string;
                url: string;
                isMain: boolean;
                altText: string | null;
            }[];
        } & {
            categoryId: string;
            description: string;
            name: string;
            id: string;
            slug: string;
            sku: string;
            price: import("@prisma/client/runtime/library").Decimal;
            compareAtPrice: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
            isActive: boolean;
            isFeatured: boolean;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findProductBySlug(slug: string): Promise<{
        category: {
            description: string | null;
            name: string;
            id: string;
            slug: string;
            imageUrl: string | null;
            parentId: string | null;
        };
        images: {
            order: number;
            id: string;
            productId: string;
            url: string;
            isMain: boolean;
            altText: string | null;
        }[];
        reviews: ({
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            images: string[];
            productId: string;
            userId: string;
            rating: number;
            comment: string | null;
            isVerified: boolean;
        })[];
    } & {
        categoryId: string;
        description: string;
        name: string;
        id: string;
        slug: string;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        compareAtPrice: import("@prisma/client/runtime/library").Decimal | null;
        stockQuantity: number;
        isActive: boolean;
        isFeatured: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllCategories(): Promise<({
        children: {
            description: string | null;
            name: string;
            id: string;
            slug: string;
            imageUrl: string | null;
            parentId: string | null;
        }[];
    } & {
        description: string | null;
        name: string;
        id: string;
        slug: string;
        imageUrl: string | null;
        parentId: string | null;
    })[]>;
    getPersonalizedRecommendations(userId?: string): Promise<({
        category: {
            description: string | null;
            name: string;
            id: string;
            slug: string;
            imageUrl: string | null;
            parentId: string | null;
        };
        images: {
            order: number;
            id: string;
            productId: string;
            url: string;
            isMain: boolean;
            altText: string | null;
        }[];
    } & {
        categoryId: string;
        description: string;
        name: string;
        id: string;
        slug: string;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        compareAtPrice: import("@prisma/client/runtime/library").Decimal | null;
        stockQuantity: number;
        isActive: boolean;
        isFeatured: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getRelatedProducts(productId: string): Promise<({
        category: {
            description: string | null;
            name: string;
            id: string;
            slug: string;
            imageUrl: string | null;
            parentId: string | null;
        };
        images: {
            order: number;
            id: string;
            productId: string;
            url: string;
            isMain: boolean;
            altText: string | null;
        }[];
    } & {
        categoryId: string;
        description: string;
        name: string;
        id: string;
        slug: string;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        compareAtPrice: import("@prisma/client/runtime/library").Decimal | null;
        stockQuantity: number;
        isActive: boolean;
        isFeatured: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
