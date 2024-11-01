import { animated, useSpring } from '@react-spring/web';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Meter, RadialAreaChart, RadialAxis } from 'reaviz';
import { deselectProduct, revealProductReview } from '../store/productReviewSlice';
import { AppDispatch, RootState } from '../store/store';
import InfoCard from './basic/InfoCard';

import image_review from './../assets/reklama.png';

interface HardwareCompletionModalProps {
    productId: number;
    onClose: () => void;
    playAnimation?: boolean;
}

const HardwareCompletionModal: React.FC<HardwareCompletionModalProps> = ({ productId, onClose, playAnimation = true }) => {
    const dispatch: AppDispatch = useDispatch();
    const review = useSelector((state: RootState) =>
        state.productReview.reviews.find(r => r.productId === productId));

    const AnimatedMeter = animated(Meter);

    if (!review) {
        console.error("review is null during review!");
        return null;
    }

    const averageRatings = review.ratings;

    const categoryData = [
        { key: 'Performance', data: averageRatings.performance },
        { key: 'Price', data: averageRatings.price },
        { key: 'Brand', data: averageRatings.brand },
        { key: 'Durability', data: averageRatings.durability }
    ];

    const finalOverallScore = categoryData.reduce((sum, item) => sum + item.data, 0) / categoryData.length;

    const handleClose = () => {
        dispatch(deselectProduct());
        onClose();
        dispatch(revealProductReview(productId));
    };

    const { value } = useSpring({
        from: { value: 0 },
        to: review.reveal || !playAnimation
            ? { value: finalOverallScore * 100 }
            : async (next) => {
                for (let i = 0; i < 5; i++) {
                    await next({ value: 100 });
                    await next({ value: 0 });
                }
                await next({ value: finalOverallScore * 100 });
            },
        config: { duration: 500 },
        reset: false,
        loop: false,
    });

    return (
        <div className="flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
            <div className="bg-white rounded shadow-lg max-w-3xl w-full">
                <InfoCard image={image_review} text={'Hardware Development Complete'} />
                <div className="flex flex-col justify-center items-center px-2">
                    <div className="w-full ">
                        <h3 className="mb-2">
                            Final Score <animated.span>{value.to(v => `${v.toFixed(0)}%`)}</animated.span>
                        </h3>
                        <AnimatedMeter value={value} columns={100} gap={1} />
                    </div>
                    <div className="flex flex-col w-full pt-2">
                        <h3 className="mb-2">Tech Reviews</h3>
                        <RadialAreaChart
                            id="tech_review"
                            data={categoryData}
                            innerRadius={5}
                            height={500}
                            axis={<RadialAxis type="category" />}
                        />
                    </div>

                </div>
                <div className="mt-4 flex justify-end px-2 pb-2">
                    <button onClick={handleClose} className="btn btn-primary">Close</button>
                </div>
            </div>
        </div>
    );
};

export default HardwareCompletionModal;
