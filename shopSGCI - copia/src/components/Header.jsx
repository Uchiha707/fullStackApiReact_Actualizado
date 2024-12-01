import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ cartCount }) => (
  <header className="header">
    <h1>GestorPro</h1>
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/cart">Carrito ({cartCount})</Link>
      <Link to="/sales-report">Reporte de Ventas</Link>
    </nav>
  </header>
);

export default Header;