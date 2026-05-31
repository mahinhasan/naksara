import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getPosts(
    @Query('tag') tag?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.blogService.findAll({ tag, page: Number(page) || 1, limit: Number(limit) || 10 });
  }

  @Get(':slug')
  async getPost(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }
}
