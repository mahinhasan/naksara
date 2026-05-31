import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsObject()
  @IsNotEmpty()
  shippingAddress: any;

  @IsObject()
  @IsOptional()
  billingAddress?: any;

  @IsString()
  @IsOptional()
  couponCode?: string;
}
