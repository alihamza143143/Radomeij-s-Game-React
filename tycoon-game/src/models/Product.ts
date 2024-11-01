// models/Product.ts
export type ProductAttributes = {
    performance: number;
    price: number;
    brand: number;
    durability: number;
};

export type ProductAttributeKey = keyof ProductAttributes;

export type ProductScores = {
    performance: number;
};

export type ProductScoresKey = keyof ProductScores;

export interface Product {
    id: number;
    name: string;
    releaseDate: {
        month: number;
        year: number;
    };
    attributes: ProductAttributes;
    scores: ProductScores;
}

export const createProduct = (
    name: string,
    releaseDate: { month: number; year: number },
    attributes: ProductAttributes,
    scores: ProductScores
): Product => {
    return {
        id: Date.now(), // Unique identifier
        name,
        releaseDate,
        attributes,
        scores,
    };
};
