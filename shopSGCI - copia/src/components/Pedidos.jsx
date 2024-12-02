// Importamos las bibliotecas necesarias de React y axios
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Definimos el componente Pedidos
const Pedidos = () => {
  // Declaramos el estado 'pedidos' para almacenar los pedidos y 'userId' para el ID del usuario
  const [pedidos, setPedidos] = useState([]);
  const userId = localStorage.getItem('userId');

  // useEffect se utiliza para realizar la llamada a la API cuando el componente se monta o 'userId' cambia
  useEffect(() => {
    // Función asincrónica para obtener los pedidos del cliente
    const fetchPedidos = async () => {
      try {
        // Realizamos una solicitud GET a la API para obtener los pedidos del cliente
        const response = await axios.get(`http://localhost:5000/api/pedidos/cliente/${userId}`);
        // Ordenamos los pedidos por fecha de creación en orden descendente
        const sortedPedidos = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // Actualizamos el estado 'pedidos' con los datos obtenidos y ordenados de la API
        setPedidos(sortedPedidos);
      } catch (error) {
        // Manejamos cualquier error que ocurra durante la solicitud
        console.error('Error al obtener los pedidos', error);
      }
    };

    // Si 'userId' existe, llamamos a la función para obtener los pedidos
    if (userId) {
      fetchPedidos();
    }
  }, [userId]);

  // Renderizamos el componente
  return (
    <div className="pedidos-container">
      <h2>Mis Pedidos</h2>
      {pedidos.length > 0 ? (
        // Mapeamos cada pedido para crear su representación en el DOM
        pedidos.map(pedido => (
          <div key={pedido._id} className="pedido-card">
            <div className="pedido-header">
              <p><strong>ID del Pedido:</strong> {pedido._id}</p>
              <p><strong>Fecha del Pedido:</strong> {new Date(pedido.createdAt).toLocaleDateString()}</p> {/* Cambiado a "Fecha del Pedido" */}
              <p><strong className={`estado ${pedido.estado.toLowerCase()}`}>Estado: {pedido.estado}</strong></p>
              <p><strong>Código de Pago:</strong> {pedido.paymentCode}</p> {/* Mostramos el código de pago */}
            </div>
            <div className="pedido-body">
              <h3>Productos</h3>
              {pedido.pedido.map(item => (
                <div key={item._id} className="pedido-item">
                  <img src={`http://localhost:5000/uploads/${item.producto?.imagen}`} alt={item.producto?.nombre} className="product-image" />
                  <div className="item-details">
                    <p><strong>Producto:</strong> {item.producto?.nombre || 'Producto eliminado'}</p>
                    <p><strong>Cantidad:</strong> {item.cantidad}</p>
                    <p><strong>Precio:</strong> ${item.producto?.precio.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pedido-footer">
              <h3>Información de Envío</h3>
              <p><strong>Nombre:</strong> {pedido.nombreEnvio}</p>
              <p><strong>Teléfono:</strong> {pedido.telefonoEnvio}</p>
              <p><strong>Dirección:</strong> {pedido.direccionEnvio}</p>
              <p><strong>Barrio:</strong> {pedido.barrioEnvio}</p>
              <p><strong>Municipio:</strong> {pedido.municipioEnvio}</p>
              <p><strong>Departamento:</strong> {pedido.departamentoEnvio}</p>
              <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
            </div>
          </div>
        ))
      ) : (
        // Si no hay pedidos, mostramos un mensaje indicando que no hay pedidos
        <p>No tienes pedidos.</p>
      )}
    </div>
  );
};

// Exportamos el componente Pedidos como el valor predeterminado del módulo
export default Pedidos;