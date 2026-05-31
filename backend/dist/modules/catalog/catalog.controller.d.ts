import { CatalogService } from './catalog.service';
export declare class CatalogController {
    private readonly catalogService;
    constructor(catalogService: CatalogService);
    getProducts(categoryId?: string, minPrice?: number, maxPrice?: number, search?: string, sortBy?: string, page?: number, limit?: number): Promise<{
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
    getProduct(slug: string): Promise<{
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
    getCategories(): Promise<({
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
    getRecommendations(userId?: string): Promise<({
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
    getRelated(id: string): Promise<({
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
