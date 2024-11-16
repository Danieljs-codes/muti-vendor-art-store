export const OrderStatus = {
    PENDING: "PENDING",
    PAID: "PAID",
    CANCELLED: "CANCELLED"
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export const ShippingStatus = {
    PENDING: "PENDING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED"
} as const;
export type ShippingStatus = (typeof ShippingStatus)[keyof typeof ShippingStatus];
export const CategoryName = {
    PAINTING: "PAINTING",
    SCULPTURE: "SCULPTURE",
    PHOTOGRAPHY: "PHOTOGRAPHY",
    DIGITAL_ART: "DIGITAL_ART",
    DRAWING: "DRAWING",
    PRINTMAKING: "PRINTMAKING",
    OTHER: "OTHER"
} as const;
export type CategoryName = (typeof CategoryName)[keyof typeof CategoryName];
