import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { ProductReview } from '../store/productReviewSlice';

interface ReviewHistoryProps {
    onSelectReview: (productId: number) => void;
}

const ReviewHistory: React.FC<ReviewHistoryProps> = ({ onSelectReview }) => {
    const reviews = useSelector((state: RootState) => state.productReview.reviews);

    return (
        <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full">
            <h2 className="text-2xl mb-4">Review History</h2>
            <ul>
                {reviews.map((review: ProductReview) => (
                    <li key={review.productId} className="mb-4">
                        <div className="flex justify-between">
                            <span>Product ID: {review.productId}</span>
                            <button 
                                className="btn btn-secondary"
                                onClick={() => onSelectReview(review.productId)}
                            >
                                View Details
                            </button>
                        </div>
                        <div className="mt-2">
                            <p>Performance: {review.ratings.performance}</p>
                            <p>Price: {review.ratings.price}</p>
                            <p>Brand: {review.ratings.brand}</p>
                            <p>Durability: {review.ratings.durability}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewHistory;
