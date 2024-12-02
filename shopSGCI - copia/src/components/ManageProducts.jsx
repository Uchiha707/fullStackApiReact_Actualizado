import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductModal from './ProductModal';


const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/productos`);
      setProducts(response.data);
    } catch (error) {
      setErrorMessage('Error al obtener los productos');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/productos/${id}`);
      fetchProducts();
      setSuccessMessage(response.data.mensaje || 'Producto eliminado con éxito');
      setTimeout(() => setSuccessMessage(''), 1000);
    } catch (error) {
      setErrorMessage('Error al eliminar el producto');
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowModal(true);
  };

  const handleAddProduct = () => {
    setProductToEdit(null);
    setShowModal(true);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/productos/busqueda/${searchQuery}`);
      setProducts(response.data);
      if (response.data.length === 0) {
        setErrorMessage('No se encontraron productos');
      }
    } catch (error) {
      setErrorMessage('Error al buscar productos');
    }
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>
      <button onClick={handleAddProduct}>Agregar Producto</button>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar productos..."
        />
        <button type="submit">Buscar</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <table className="tablaProductos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.nombre}</td>
              <td>{product.descripcion}</td>
              <td>${product.precio}</td>
              <td>{product.stock}</td>
              <td>
                {product.imagen && <img src={`${import.meta.env.VITE_API_URL}/uploads/${product.imagen}`} alt={product.nombre} width="100" />}
              </td>
              <td>
                <button className="edit-button" onClick={() => handleEditProduct(product)}>Editar</button>
                <button onClick={() => handleDeleteProduct(product._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProductModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        fetchProducts={fetchProducts}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default ManageProducts;