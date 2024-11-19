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
export const ArtCondition = {
    MINT: "MINT",
    EXCELLENT: "EXCELLENT",
    GOOD: "GOOD",
    FAIR: "FAIR",
    POOR: "POOR"
} as const;
export type ArtCondition = (typeof ArtCondition)[keyof typeof ArtCondition];
