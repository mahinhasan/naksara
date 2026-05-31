declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    shippingAddress: any;
    billingAddress?: any;
    couponCode?: string;
}
export {};
