import { calculateLikelihood } from '@/utils/consumerUtils';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const ProductList: React.FC = () => {
    const products = useSelector((state: RootState) => state.competitors.products);
    const consumers = useSelector((state: RootState) => state.consumers.populations);

    return (
        <div className="w-3/4 mx-auto">
            <h2 className="text-xl font-bold mb-4">Competitors Product List</h2>
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
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{`${product.releaseDate.month}/${product.releaseDate.year}`}</td>
                            {consumers.map((_consumer, consumerIndex) => {
                                const rating = calculateLikelihood(_consumer, product, 0);
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

export default ProductList;
