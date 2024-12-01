import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartMenu from './components/CartMenu';
import CartPage from './components/CartPage';
import SalesReport from './components/SalesReport';
import InvoiceForm from './components/InvoiceForm';
import InvoicePDF from './components/InvoicePDF';

const initialProducts = [
  { id: 1, name: 'Producto 1', price: 29.99, image: '/images/producto1.jpg' },
  { id: 2, name: 'Producto 2', price: 19.99, image: '/images/producto2.jpg' },
  { id: 3, name: 'Producto 3', price: 39.99, image: '/images/producto3.jpg' },
];


const initialSalesData = [
  { time: '2023-01-01', value: 100 },
  { time: '2023-02-01', value: 200 },
  { time: '2023-03-01', value: 150 },
  { time: '2023-04-01', value: 400 },
  { time: '2023-05-01', value: 300 },
  { time: '2023-06-01', value: 250 },
  { time: '2023-07-01', value: 350 },
  { time: '2024-01-01', value: 450 },
  { time: '2024-02-01', value: 500 },
  { time: '2024-03-01', value: 550 },
  { time: '2024-04-01', value: 600 },
  { time: '2024-05-01', value: 650 },
  { time: '2024-06-01', value: 700 },
];

const App = () => {
  const [products] = useState(initialProducts);
  const [salesData] = useState(initialSalesData);
  const [cartItems, setCartItems] = useState([]);
  const [showCartMenu, setShowCartMenu] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  const navigate = useNavigate();

  const handleAddToCart = (product, quantity) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { product, quantity }]);
    }
    setShowCartMenu(true);
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const handleReduceQuantity = (productId) => {
    const existingItem = cartItems.find(item => item.product.id === productId);
    if (existingItem.quantity > 1) {
      setCartItems(cartItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      handleRemoveFromCart(productId);
    }
  };

  const handleCloseCartMenu = () => {
    setShowCartMenu(false);
  };

  const handlePaymentInfo = (info) => {
    setPaymentInfo(info);
  };

  return (
    <div className="app">
  
      <Header cartCount={cartItems.length} />
 
      <Routes>
        <Route
          path="/"
          element={<ProductList products={products} onAddToCart={handleAddToCart} />}
        />
       
        <Route
          path="/cart"
          element={<CartPage
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onReduceQuantity={handleReduceQuantity}
          />}
        />
        
        <Route path="/sales-report" element={<SalesReport data={salesData} />} />
        <Route path="/invoice" element={<InvoiceForm cartItems={cartItems} />} />
        <Route path="/invoice-pdf" element={<InvoicePDF />} />
        
      </Routes>

      {showCartMenu && (
        <CartMenu
          cartItems={cartItems}
          onClose={handleCloseCartMenu}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onReduceQuantity={handleReduceQuantity}
        />
      )}

    </div>
  );
};

export default App;
