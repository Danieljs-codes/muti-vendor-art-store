import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { ShippingStatus, CategoryName, ArtCondition } from "./enums";

export type account = {
    id: string;
    accountId: string;
    providerId: string;
    userId: string;
    accessToken: string | null;
    refreshToken: string | null;
    idToken: string | null;
    expiresAt: Timestamp | null;
    password: string | null;
};
export type artist = {
    id: string;
    name: string;
    bio: string;
    portfolioUrl: string | null;
    paystackSubAccountCode: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    userId: string;
};
export type artwork = {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrls: string[];
    dimensions: string;
    weight: number | null;
    condition: ArtCondition;
    stock: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    artistId: string;
    category: CategoryName;
    categoryId: string;
};
export type artworkTocart = {
    A: string;
    B: string;
};
export type artworkTodiscount = {
    A: string;
    B: string;
};
export type artworkTowishlist = {
    A: string;
    B: string;
};
export type cart = {
    id: string;
    userId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
export type discount = {
    id: string;
    code: string;
    description: string;
    percentage: number;
    startDate: Timestamp;
    endDate: Timestamp;
    minAmount: number | null;
    maxUses: number | null;
    usedCount: Generated<number>;
    isActive: Generated<boolean>;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
export type order = {
    id: string;
    userId: string;
    totalPrice: number;
    shippingStatus: Generated<ShippingStatus>;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
export type orderItem = {
    id: string;
    orderId: string;
    artworkId: string;
    quantity: number;
    price: string;
    discountId: string | null;
    discountAmount: string | null;
    finalPrice: string;
    platformFee: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
export type review = {
    id: string;
    content: string;
    rating: number;
    createdAt: Timestamp;
    userId: string;
    artworkId: string;
};
export type session = {
    id: string;
    expiresAt: Timestamp;
    ipAddress: string | null;
    userAgent: string | null;
    userId: string;
};
export type user = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
export type verification = {
    id: string;
    identifier: string;
    value: string;
    expiresAt: Timestamp;
    createdAt: Timestamp | null;
};
export type wishlist = {
    id: string;
    userId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
export type DB = {
    _artworkTocart: artworkTocart;
    _artworkTodiscount: artworkTodiscount;
    _artworkTowishlist: artworkTowishlist;
    account: account;
    artist: artist;
    artwork: artwork;
    cart: cart;
    discount: discount;
    order: order;
    orderItem: orderItem;
    review: review;
    session: session;
    user: user;
    verification: verification;
    wishlist: wishlist;
};
