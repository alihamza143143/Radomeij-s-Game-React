import productData from '../data/product_data.json';
import { Product, createProduct, ProductAttributes, ProductScores } from '../models/Product';

// Interface for raw product data
interface ProductDataRaw {
    name: string;
    releaseDate: {
        month: number;
        year: number;
    };
    attributes: ProductAttributes;
    scores?: ProductScores; // Mark scores as optional
}

// Function to load products data
export const loadProductsData = (): Product[] => {
    const data: ProductDataRaw[] = productData as ProductDataRaw[];
    return data.map(product => {
        const scores: ProductScores = product.scores ? product.scores : { performance: 1 };
        return createProduct(
            product.name,
            product.releaseDate,
            product.attributes,
            scores
        );
    });
};
