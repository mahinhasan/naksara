import { BlogService } from './blog.service';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    getPosts(tag?: string, page?: number, limit?: number): Promise<{
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
    getPost(slug: string): Promise<{
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
