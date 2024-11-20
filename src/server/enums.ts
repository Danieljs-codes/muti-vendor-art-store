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
    DIGITAL: "DIGITAL",
    MIXED_MEDIA: "MIXED_MEDIA",
    DRAWING: "DRAWING",
    PRINTMAKING: "PRINTMAKING",
    TEXTILE: "TEXTILE",
    CERAMIC: "CERAMIC",
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
export const UploadStatus = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED"
} as const;
export type UploadStatus = (typeof UploadStatus)[keyof typeof UploadStatus];
