
export interface SocialMedia {
    platform: string;
    username: string;
}

export interface Influencer {
    name: string;
    description: string;
    social_medias: SocialMedia[];
}

export interface ProductId {
    product_id_value: string;
    date_modified?: Date;
    date_published?: Date;
    product_id_type: string
}

export interface ProductCategory {
    id: number;
    name: string;
    description: string;
}

export interface ProductPrice {
    id: number;
    source: string;
    list_price: string;
    discounted_price: string;
    discount: string;
    date_modified: Date;
    date_added: Date;
}

export interface ProductImage {
    image_url: string
}

export interface Product {
    product_name: string;
    company_name: string;
    company_website: string;
    merchant_product_page?: string;
    product_description: string;
    product_images?: ProductImage[];
    product_ids: ProductId[];
    product_categories?: ProductCategory[];
    prices: ProductPrice[];
}

export interface Coupon {
    coupon_code: string;
}

export interface Promotion {
    influencer?: Influencer;
    product: Product;
    videos?: any[];
    images?: any[];
    social_media_type: string;
    coupon_description: string;
    coupon_code_in_the_link?: any;
    post_link: string;
    post_promotion_date: Date;
    promotion_expiration_date: Date;
    advertisement_link: string;
    date_modified: Date;
    coupons?: Coupon[];
}


export interface SearchRequestForm {
    product_id_type: string;
    product_id_value: string;
    product_name?: string;
    company_website?: string;
    company_name?: string;
    product_price?: string;
    product_page?: string;
    product_description?: string;
}