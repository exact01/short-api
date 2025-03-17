import { Products } from '@prisma/client';

export class ProductEntity implements Products {
    public uuid: string;
    public marketHashName: string;
    public currency: string;
    public suggestedPrice: number;
    public itemPage: string;
    public marketPage: string;
    public minPrice: number;
    public maxPrice: number;
    public meanPrice: number;
    public medianPrice: number;
    public quantity: number;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(product: Partial<Products>) {
        Object.assign(this, product);
        return this;
    }
}
