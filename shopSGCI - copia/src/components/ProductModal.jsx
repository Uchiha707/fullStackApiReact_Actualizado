import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductModal = ({ showModal, closeModal, fetchProducts, productToEdit }) => {
  const initialProductData = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen: null
  };

  const [productData, setProductData] = useState(initialProductData);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setProductData({
        nombre: productToEdit.nombre,
        descripcion: productToEdit.descripcion,
        precio: productToEdit.precio,
        stock: productToEdit.stock,
        imagen: null
      });
    } else {
      setProductData(initialProductData);
    }
  }, [productToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setProductData({
      ...productData,
      imagen: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', productData.nombre);
    formData.append('descripcion', productData.descripcion);
    formData.append('precio', productData.precio);
    formData.append('stock', productData.stock);
    formData.append('imagen', productData.imagen);

    try {
      let response;
      if (productToEdit) {
        response = await axios.put(`${import.meta.env.VITE_API_URL}/api/productos/${productToEdit._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/api/productos`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      setSuccessMessage(response.data.mensaje || 'Operación exitosa');
      fetchProducts();
      setProductData(initialProductData); // Limpiar el formulario después de agregar/actualizar
      setTimeout(() => {
        closeModal();
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.mensaje || 'Error al guardar el producto');
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="modalProducto-overlay">
      <div className="modalProducto">
        <button className="modalProducto-close" onClick={closeModal}>×</button>
        <h2>{productToEdit ? 'Actualizar Producto' : 'Agregar Producto'}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input type="text" name="nombre" value={productData.nombre} onChange={handleInputChange} />
          </label>
          <label>
            Descripción:
            <input type="text" name="descripcion" value={productData.descripcion} onChange={handleInputChange} />
          </label>
          <label>
            Precio:
            <input type="number" name="precio" value={productData.precio} onChange={handleInputChange} />
          </label>
          <label>
            Stock:
            <input type="number" name="stock" value={productData.stock} onChange={handleInputChange} />
          </label>
          <label>
            Imagen:
            <input type="file" name="imagen" onChange={handleFileChange} />
          </label>
          <button type="submit">{productToEdit ? 'Actualizar' : 'Agregar'}</button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;