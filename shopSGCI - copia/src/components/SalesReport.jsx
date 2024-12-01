import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const SalesReport = ({ data }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        textColor: 'black',
        backgroundColor: 'white',
      },
    });

    const salesSeries = chart.addAreaSeries({
      lineColor: '#2962FF',
      topColor: 'rgba(41, 98, 255, 0.5)',
      bottomColor: 'rgba(41, 98, 255, 0.1)',
    });

    salesSeries.setData(data);

    return () => chart.remove();
  }, [data]);

  return (
    <div className="sales-report">
      <h1>Reporte de Ventas</h1>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default SalesReport;