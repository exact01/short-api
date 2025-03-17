import { PrismaClient } from '@prisma/client';
import * as fs from 'node:fs';
import * as path from 'node:path';

const prisma = new PrismaClient();

async function main() {
    try {
        // Read products data from JSON file
        const productsData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'public', 'products.json'), 'utf-8'),
        );

        console.log(`Found ${productsData.length} products to seed`);

        // Create products in database
        for (const product of productsData) {
            await prisma.products.create({
                data: {
                    marketHashName: product.market_hash_name,
                    currency: product.currency,
                    suggestedPrice: product.suggested_price,
                    itemPage: product.item_page,
                    marketPage: product.market_page,
                    minPrice: product.min_price || 0,
                    maxPrice: product.max_price || 0,
                    meanPrice: product.mean_price || 0,
                    medianPrice: product.median_price || 0,
                    quantity: product.quantity,
                    createdAt: new Date(product.created_at * 1000),
                    updatedAt: new Date(product.updated_at * 1000),
                },
            });
        }

        console.log('Database seeding completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 