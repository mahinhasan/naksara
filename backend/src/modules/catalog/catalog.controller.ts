import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  async getProducts(
    @Query('categoryId') categoryId?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.catalogService.findAllProducts({
      categoryId,
      minPrice,
      maxPrice,
      search,
      sortBy,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('products/:slug')
  async getProduct(@Param('slug') slug: string) {
    const product = await this.catalogService.findProductBySlug(slug);
    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }
    return product;
  }

  @Get('categories')
  async getCategories() {
    return this.catalogService.findAllCategories();
  }

  @Get('recommendations')
  async getRecommendations(@Query('userId') userId?: string) {
    return this.catalogService.getPersonalizedRecommendations(userId);
  }

  @Get('products/:id/related')
  async getRelated(@Param('id') id: string) {
    return this.catalogService.getRelatedProducts(id);
  }
}
