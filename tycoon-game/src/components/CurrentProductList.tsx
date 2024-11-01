import React from 'react';
import { useSelector } from 'react-redux';
import { ConsumerService } from '../services/ConsumerService';
import { RootState } from '../store/store';

const CurrentProductList: React.FC = () => {
    const products = useSelector((state: RootState) => state.product.products);
    const currentYear = useSelector((state: RootState) => state.game.year);
    const consumers = useSelector((state: RootState) => state.consumers.populations);
    const consumerService = ConsumerService.getInstance();

    const currentProducts = products.filter(product => product.releaseDate.year <= currentYear);

    return (
        <div className="w-3/4 mx-auto">
            <h2 className="text-xl font-bold mb-4">Current Products for {currentYear}</h2>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Release Date</th>
                        {consumers.map((consumer, index) => (
                            <th key={index} className="px-4 py-2">{consumer.name} Rating</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{`${product.releaseDate.month}/${product.releaseDate.year}`}</td>
                            {consumers.map((_consumer, consumerIndex) => {
                                const rating = consumerService.calculatePurchaseLikelihood(consumerIndex, index);
                                return (
                                    <td key={consumerIndex} className="border px-4 py-2">
                                        {rating !== null ? rating.toFixed(2) : 'N/A'}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CurrentProductList;
