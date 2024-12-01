// src/components/InvoiceForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InvoiceForm = ({ cartItems }) => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', barrio: '', municipio: '', departamento: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentCode = Math.floor(Math.random() * 1000000);
    console.log(cartItems); // Verificar que cartItems contiene datos
    navigate('/invoice-pdf', { state: { ...formData, cartItems, paymentCode } });
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