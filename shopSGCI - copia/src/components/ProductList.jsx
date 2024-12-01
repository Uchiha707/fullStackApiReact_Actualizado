import React from 'react';
import Product from './Product';

const ProductList = ({ products, onAddToCart }) => (
  <div className="product-list">
    {products.map(product => (
      <Product key={product.id} product={product} onAddToCart={onAddToCart} />
    ))}
  </div>
);

export default ProductList;