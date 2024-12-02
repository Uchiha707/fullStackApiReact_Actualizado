import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Componente para actualizar los datos del usuario.
 */
const UpdateUser = () => {
  // Estado inicial del formulario del usuario.
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Estado para manejar errores y éxito.
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Hook de navegación para redirigir al usuario.
  const navigate = useNavigate();

  /**
   * Efecto que se ejecuta al montar el componente para
   * establecer el estado inicial del usuario desde el localStorage.
   */
  useEffect(() => {
    setUser({
      username: localStorage.getItem('username') || '',
      email: localStorage.getItem('email') || '',
      password: ''
    });
  }, []);

  /**
   * Maneja los cambios en los campos del formulario.
   * @param {Event} e - El evento del cambio.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  /**
   * Maneja el envío del formulario.
   * @param {Event} e - El evento del envío.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Obtiene el token de autenticación del localStorage.
      const token = localStorage.getItem('token');
      
      // Prepara el objeto de actualización solo con los campos modificados.
      const updatedUser = {};
      if (user.username && user.username !== localStorage.getItem('username')) {
        updatedUser.username = user.username;
      }
      if (user.email && user.email !== localStorage.getItem('email')) {
        updatedUser.email = user.email;
      }
      if (user.password) {
        updatedUser.password = user.password;
      }

      // Verifica si hay cambios para actualizar.
      if (Object.keys(updatedUser).length === 0) {
        setError('No hay cambios para actualizar');
        return;
      }

      // Realiza la petición de actualización al servidor.
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/update`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Actualiza los valores en el localStorage si se han cambiado.
      if (updatedUser.username) {
        localStorage.setItem('username', response.data.user.username);
      }
      if (updatedUser.email) {
        localStorage.setItem('email', response.data.user.email);
      }

      // Muestra el mensaje de éxito.
      setSuccess('Datos actualizados exitosamente');
      setError(null);

      // Borra el mensaje de éxito después de 3 segundos.
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (error) {
      // Maneja los errores de la petición.
      setError(error.response ? error.response.data.error : 'Error al actualizar los datos');
      setSuccess(null);
    }
  };

  return (
    <div className="update-user-form">
      <h2>Actualizar Datos del Usuario</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default UpdateUser;