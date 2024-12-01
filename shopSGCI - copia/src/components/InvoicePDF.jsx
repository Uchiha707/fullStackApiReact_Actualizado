import React from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar el plugin de autotable

const InvoicePDF = () => {
  const location = useLocation();
  const { name, email, address, barrio, municipio, departamento, cartItems, paymentCode } = location.state;
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'letter'); // Tamaño carta (8.5 x 11 pulgadas)

    // Añadir logotipo (asegúrate de que la imagen esté disponible en la ruta especificada)
    const logo = '/logo.png'; // Reemplazar con la ruta de tu logotipo
    doc.addImage(logo, 'PNG', 10, 10, 50, 20);

    // Encabezado
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'bold');
    doc.text('Factura', 105, 20, null, null, 'center');

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text('Nombre de la Empresa', 105, 30, null, null, 'center');
    doc.text('Dirección de la Empresa', 105, 35, null, null, 'center');
    doc.text('Teléfono: 123-456-7890', 105, 40, null, null, 'center');
    doc.text('Correo: empresa@correo.com', 105, 45, null, null, 'center');

    // Información del cliente
    doc.setFontSize(12);
    let yOffset = 60;
    const lineSpacing = 10;
    const labelX = 14;
    const valueX = 60;

    doc.setTextColor(0, 0, 0);

    doc.setFont('helvetica', 'bold');
    doc.text('Factura para:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(name, valueX, yOffset);

    yOffset += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Correo:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(email, valueX, yOffset);

    yOffset += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Dirección:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(address, valueX, yOffset);

    yOffset += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Barrio:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(barrio, valueX, yOffset);

    yOffset += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Municipio:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(municipio, valueX, yOffset);

    yOffset += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Departamento:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(departamento, valueX, yOffset);

    yOffset += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Código de Pago:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentCode.toString(), valueX, yOffset);

    yOffset += lineSpacing + 10; // Espacio extra antes de la tabla

    // Tabla de artículos
    const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Total"];
    const tableRows = [];

    cartItems.forEach(item => {
      const productData = [
        item.product.name,
        item.quantity.toString(),
        `$${item.product.price.toFixed(2)}`,
        `$${(item.product.price * item.quantity).toFixed(2)}`,
      ];
      tableRows.push(productData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yOffset,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }, // Color de fondo del encabezado
      alternateRowStyles: { fillColor: [240, 240, 240] } // Color de fondo alternativo para las filas
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: $${total.toFixed(2)} USD`, labelX, finalY);

    // Pie de página
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(0, 128, 0); // Verde
    doc.text('Gracias por su compra', 105, finalY + 20, null, null, 'center');
    doc.text('Por favor, conserve esta factura para sus registros', 105, finalY + 30, null, null, 'center');

    // Guardar el PDF
    doc.save('factura.pdf');
  };

  return (
    <div className="payment-form">
      <h1>Factura</h1>
      <p>Nombre: {name}</p>
      <p>Correo: {email}</p>
      <p>Dirección: {address}</p>
      <p>Barrio: {barrio}</p>
      <p>Municipio: {municipio}</p>
      <p>Departamento: {departamento}</p>
      <p>Código de Pago: {paymentCode}</p>
      <h2>Artículos:</h2>
      {cartItems.map(item => (
        <div key={item.product.id}>
          <span>{item.product.name} (x{item.quantity})</span>
          <span>{item.product.price * item.quantity} USD</span>
        </div>
      ))}
      <h2>Total: {total} USD</h2>
      <button onClick={generatePDF}>Descargar Factura en PDF</button>
      <button onClick={() => alert('Proceder al pago PSE o en efectivo')}>Proceder al Pago</button>
    </div>
  );
};

export default InvoicePDF;