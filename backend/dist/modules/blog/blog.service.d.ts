import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        tag?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: {
            id: string;
            slug: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
            title: string;
            content: string;
            excerpt: string | null;
            authorId: string;
            isPublished: boolean;
            tags: string[];
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<{
        id: string;
        slug: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        title: string;
        content: string;
        excerpt: string | null;
        authorId: string;
        isPublished: boolean;
        tags: string[];
    }>;
    create(data: any): Promise<{
        id: string;
        slug: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        title: string;
        content: string;
        excerpt: string | null;
        authorId: string;
        isPublished: boolean;
        tags: string[];
    }>;
}
