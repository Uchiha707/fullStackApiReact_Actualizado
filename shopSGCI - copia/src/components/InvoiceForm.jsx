// src/components/InvoiceForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InvoiceForm = ({ cartItems }) => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', barrio: '', municipio: '', departamento: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const paymentCode = Math.floor(Math.random() * 1000000);
    const pedido = {
      cliente: localStorage.getItem('userId'), 
      pedido: cartItems.map(item => ({
        producto: item.product.id,
        cantidad: item.quantity
      })),
      total: cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0), 
      paymentCode, 
      nombreEnvio: formData.name,
      telefonoEnvio: formData.email, // Suponiendo que el email se usa como teléfono
      direccionEnvio: formData.address,
      barrioEnvio: formData.barrio,
      municipioEnvio: formData.municipio,
      departamentoEnvio: formData.departamento
    };

    console.log(pedido); // Añadir esta línea para verificar el objeto pedido

    try {
      await axios.post('http://localhost:5000/api/pedidos/nuevo', pedido);
      navigate('/invoice-pdf', { state: { ...formData, cartItems, paymentCode } });
    } catch (error) {
      console.error('Error al enviar el pedido', error);
    } 
  };

  return (
    <div className="payment-form">
      <h1>Invoice Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombres y apellidos completos</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Dirección de residencia</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div>
          <label>Barrio</label>
          <input type="text" name="barrio" value={formData.barrio} onChange={handleChange} required />
        </div>
        <div>
          <label>Municipio</label>
          <input type="text" name="municipio" value={formData.municipio} onChange={handleChange} required />
        </div>
        <div>
          <label>Departamento</label>
          <input type="text" name="departamento" value={formData.departamento} onChange={handleChange} required />
        </div>
        <button type="submit">Generar factura</button>
      </form>
    </div>
  );
};

export default InvoiceForm;