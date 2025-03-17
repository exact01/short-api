export const PRODUCT_MODULES = {
    ProductController: Symbol.for('ProductController'),
    ProductService: Symbol.for('ProductService'),
    ProductsRepository: Symbol.for('ProductsRepository'),
    ProductConverter: Symbol.for('ProductConverter'),
} as const;
