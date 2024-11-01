import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { selectProduct } from '../store/productReviewSlice';

const CreatedProducts: React.FC = () => {
  const dispatch = useDispatch();
  const createdProducts = useSelector((state: RootState) => state.playerHistory.createdProducts);

  const handleOpenModal = (productId: number) => {
    dispatch(selectProduct(productId));
  };

  return (
    <div className="p-2">
      <h2 className="mb-4 bg-white bg-opacity-10">Created Products</h2>
      {createdProducts.length === 0 ? (
        <p>No products created yet.</p>
      ) : (
        <table className="table table-xs w-full">
          <thead>
            <tr>
              <th className="w-2/5 text-left">Name</th>
              <th className="">Release Date</th>
              <th className="">Performance</th>
              <th className="">Price</th>
              <th className="">Brand</th>
              <th className="">Durability</th>
              <th className="">Actions</th>
            </tr>
          </thead>
          <tbody>
            {createdProducts.map((product) => (
              <tr key={product.id}>
                <td className="">{product.name}</td>
                <td className="">{`${product.releaseDate.month}/${product.releaseDate.year}`}</td>
                <td className="">{product.attributes.performance.toFixed(2)}</td>
                <td className="">{product.attributes.price.toFixed(2)}</td>
                <td className="">{product.attributes.brand.toFixed(2)}</td>
                <td className="">{product.attributes.durability.toFixed(2)}</td>
                <td className="">
                  <button 
                    className="btn btn-info btn-sm"
                    onClick={() => handleOpenModal(product.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CreatedProducts;
