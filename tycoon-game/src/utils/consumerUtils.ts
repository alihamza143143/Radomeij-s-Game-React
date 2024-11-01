import { ConsumerPopulation } from "@/models/ConsumerPopulation";
import { Product } from "@/models/Product";

export const calculateLikelihood = (consumer: ConsumerPopulation, product: Product, daysOnMarket: number): number => {
    let score = 0;
    let totalWeight = 0;

    for (let key in consumer.attributes) {
        if (product.attributes.hasOwnProperty(key)) {
            const attributeKey = key as keyof typeof product.attributes;
            score += consumer.attributes[attributeKey] * product.attributes[attributeKey] - (daysOnMarket / 2500); // Older products are less attractive
            totalWeight += consumer.attributes[attributeKey];
        }
    }

    return Math.min(1, totalWeight > 0 ? score / totalWeight : 0);
};