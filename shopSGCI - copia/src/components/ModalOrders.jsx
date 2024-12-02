import React, { useState } from 'react';
import axios from 'axios';

const ModalOrders = ({ order, setSelectedOrder, setOrders, setFilteredOrders, orders, filteredOrders }) => {
  const [orderToDelete, setOrderToDelete] = useState(null);

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/pedidos/${updatedOrder._id}`, updatedOrder);
      setOrders(orders.map(o => (o._id === updatedOrder._id ? response.data : o)));
      setFilteredOrders(filteredOrders.map(o => (o._id === updatedOrder._id ? response.data : o)));
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error al actualizar el pedido', error);
    }
  };

  const confirmDeleteOrder = () => {
    setOrderToDelete(order._id);
  };

  const handleDeleteOrder = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/pedidos/${orderToDelete}`);
      setOrders(orders.filter(o => o._id !== orderToDelete));
      setFilteredOrders(filteredOrders.filter(o => o._id !== orderToDelete));
      setOrderToDelete(null);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error al eliminar el pedido', error);
    }
  };

  const handleCloseConfirmation = () => {
    setOrderToDelete(null);
  };

  return (
    <div className="modal">
      <div className="modal-contenido">
        <button className="cerrar-boton" onClick={() => setSelectedOrder(null)}>×</button>
        <h3>Actualizar Pedido</h3>
        <div className="form-fila">
          <label>
            Estado:
            <select
              value={order.estado}
              onChange={(e) => setSelectedOrder({ ...order, estado: e.target.value })}
              className="estado-select"
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="PAGADO">Pagado</option>
              <option value="ENVIADO">Enviado</option>
            </select>
          </label>
        </div>
        <div className="form-fila">
          <div className="form-columna">
            <label>
              Nombre de Envío:
              <input
                type="text"
                value={order.nombreEnvio}
                onChange={(e) => setSelectedOrder({ ...order, nombreEnvio: e.target.value })}
              />
            </label>
          </div>
          <div className="form-columna">
            <label>
              Teléfono de Envío:
              <input
                type="text"
                value={order.telefonoEnvio}
                onChange={(e) => setSelectedOrder({ ...order, telefonoEnvio: e.target.value })}
              />
            </label>
          </div>
          <div className="form-columna">
            <label>
              Dirección de Envío:
              <input
                type="text"
                value={order.direccionEnvio}
                onChange={(e) => setSelectedOrder({ ...order, direccionEnvio: e.target.value })}
              />
            </label>
          </div>
        </div>
        <div className="form-fila">
          <div className="form-columna">
            <label>
              Barrio:
              <input
                type="text"
                value={order.barrioEnvio}
                onChange={(e) => setSelectedOrder({ ...order, barrioEnvio: e.target.value })}
              />
            </label>
          </div>
          <div className="form-columna">
            <label>
              Municipio:
              <input
                type="text"
                value={order.municipioEnvio}
                onChange={(e) => setSelectedOrder({ ...order, municipioEnvio: e.target.value })}
              />
            </label>
          </div>
          <div className="form-columna">
            <label>
              Departamento:
              <input
                type="text"
                value={order.departamentoEnvio}
                onChange={(e) => setSelectedOrder({ ...order, departamentoEnvio: e.target.value })}
              />
            </label>
          </div>
        </div>
        <div className="boton-fila">
          <button onClick={() => handleUpdateOrder(order)}>Actualizar</button>
          <button onClick={confirmDeleteOrder}>Eliminar</button>
        </div>
        {orderToDelete && (
          <div className="modal-confirmacion">
            <div className="modal-contenido-confirmacion">
              <div className="confirmacion-logo">⚠️</div>
              <div className="confirmacion-mensaje">¿Está seguro de que desea eliminar este pedido?</div>
              <div className="boton-confirmacion-fila">
                <button className="confirmar" onClick={handleDeleteOrder}>Eliminar</button>
                <button className="cancelar" onClick={handleCloseConfirmation}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalOrders;