import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'; // Importar useLocation
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartMenu from './components/CartMenu';
import CartPage from './components/CartPage';
import SalesReport from './components/SalesReport';
import InvoiceForm from './components/InvoiceForm';
import InvoicePDF from './components/InvoicePDF';
import axios from 'axios'; // Importar axios
import Register from './components/Register'; 
import Login from './components/Login';
import ManageProducts from './components/ManageProducts';
import Pedidos from './components/Pedidos'; 

const initialProducts = [];


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

// Función de mapeo para transformar los datos de la API
const mapProductData = (product) => {
  return {
    id: product._id,
    name: product.nombre, 
    price: product.precio,
    imagen: product.imagen,
    // Agrega más mapeos según sea necesario
  };
};

const App = () => {
  const [products, setProducts] = useState(initialProducts);
  const [salesData] = useState(initialSalesData);
  const [cartItems, setCartItems] = useState([]);
  const [showCartMenu, setShowCartMenu] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  const navigate = useNavigate();
  const location = useLocation(); // Usar useLocation para rastrear la ubicación

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productos');
        console.log('Productos desde la API:', response.data);
        // Mapeamos los productos antes de establecerlos en el estado
        const mappedProducts = response.data.map(mapProductData);
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error al obtener los productos', error);
      }
    };

    if (location.pathname === '/') {
      fetchProducts();
    }
  }, [location.pathname]);

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

  const PrivateRoute = ({ children }) => {
    const role = localStorage.getItem('role');
    return role === 'admin' ? children : <div>No tienes acceso a esta página</div>;
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
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manage-products" element={<PrivateRoute><ManageProducts /></PrivateRoute>} />
        <Route path="/pedidos" element={<Pedidos />} /> {/* Nueva ruta para el componente Pedidos */}
        
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
