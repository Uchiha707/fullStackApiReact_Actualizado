import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      setMessage('Registro exitoso');
      localStorage.setItem('username', formData.username);
      window.dispatchEvent(new Event('storage')); // Disparar evento de almacenamiento
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error en el registro');
    }
  };

  return (
    <div className="payment-form">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {message && <p>{message}</p>}
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;