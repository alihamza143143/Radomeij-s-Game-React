import { playSound } from '@/utils/soundUtils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConsumerPopulation } from '../models/ConsumerPopulation';
import { Product } from '../models/Product';
import { setGameSpeed } from './gameSlice';
import { loadState } from './saves/actions';
import { AppDispatch, RootState } from './store';

export interface ConsumerRating {
    consumerId: string;
    rating: number;
}

export interface ProductReview {
    productId: number;
    ratings: {
        performance: number;
        price: number;
        brand: number;
        durability: number;
    };
    consumerRatings: ConsumerRating[];
    reveal: boolean; // Nowy parametr reveal
}

export interface ProductReviewState {
    reviews: ProductReview[];
    selectedProductId: number | null;
}

const initialState: ProductReviewState = {
    reviews: [],
    selectedProductId: null,
};

export const calculatePurchaseLikelihood = (consumer: ConsumerPopulation, product: Product): number => {
    let score = 0;
    let totalWeight = 0;

    for (let key in consumer.attributes) {
        if (product.attributes.hasOwnProperty(key)) {
            const attributeKey = key as keyof typeof product.attributes;
            score += consumer.attributes[attributeKey] * product.attributes[attributeKey];
            totalWeight += consumer.attributes[attributeKey];
        }
    }

    return totalWeight > 0 ? score / totalWeight : 0;
};

export const calculateConsumerRatings = 
    (product: Product, consumers: ConsumerPopulation[]) => 
    async (dispatch: AppDispatch, getState: () => RootState) => {

        const consumerRatings = consumers.map((consumer) => ({
            consumerId: consumer.name,
            rating: calculatePurchaseLikelihood(consumer, product) ?? 0,
        }));

        const newReview: ProductReview = {
            productId: product.id,
            ratings: {
                performance: product.attributes.performance,
                price: product.attributes.price,
                brand: product.attributes.brand,
                durability: product.attributes.durability,
            },
            consumerRatings,
            reveal: false, // Inicjalizacja reveal jako false
        };

        await dispatch(setGameSpeed(0));
        await dispatch(addReview(newReview));
        await dispatch(selectProduct(product.id));
        dispatch(playSound(5));
    };

export const revealProductReview = 
    (productId: number) => 
    (dispatch: AppDispatch, getState: () => RootState) => {
        const { reviews } = getState().productReview;
        const reviewIndex = reviews.findIndex(review => review.productId === productId);

        if (reviewIndex !== -1) {
            dispatch(updateReviewReveal({ productId, reveal: true }));
        }
    };

interface UpdateRevealPayload {
    productId: number;
    reveal: boolean;
}

const productReviewSlice = createSlice({
    name: 'productReview',
    initialState,
    reducers: {
        addReview(state, action: PayloadAction<ProductReview>) {
            state.reviews.push(action.payload);
        },
        selectProduct(state, action: PayloadAction<number>) {
            state.selectedProductId = action.payload;
        },
        deselectProduct(state) {
            state.selectedProductId = null;
        },
        updateReviewReveal(state, action: PayloadAction<UpdateRevealPayload>) {
            const { productId, reveal } = action.payload;
            const review = state.reviews.find(review => review.productId === productId);
            if (review) {
                review.reveal = reveal;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
            return action.payload?.productReview || state;
        });
    },
});

export const { addReview, selectProduct, deselectProduct, updateReviewReveal } = productReviewSlice.actions;
export default productReviewSlice.reducer;
