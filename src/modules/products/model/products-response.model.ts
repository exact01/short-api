import { ProductEntity } from '../entities/product.entity';

export class ProductResponseModel {
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

    constructor(entity: ProductEntity) {
        this.uuid = entity.uuid;
        this.marketHashName = entity.marketHashName;
        this.currency = entity.currency;
        this.minPrice = entity.minPrice;
        this.meanPrice = entity.meanPrice;
        this.suggestedPrice = entity.suggestedPrice;
        this.quantity = entity.quantity;
    }
}
