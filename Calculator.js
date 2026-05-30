import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import './Calculator.css';

function Calculator() {
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), brand_id: '', quantity: 1 }]);
  };

  const removeRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const getProductDetails = (brandId) => {
    return products.find(p => p.id === parseInt(brandId));
  };

  const calculateRowPTS = (row) => {
    const product = getProductDetails(row.brand_id);
    if (product && row.quantity) {
      return product.pts_excl_gst * row.quantity;
    }
    return 0;
  };

  const calculateRowMRP = (row) => {
    const product = getProductDetails(row.brand_id);
    if (product && row.quantity) {
      return product.mrp * row.quantity;
    }
    return 0;
  };

  const totalPTS = rows.reduce((sum, row) => sum + calculateRowPTS(row), 0);
  const totalMRP = rows.reduce((sum, row) => sum + calculateRowMRP(row), 0);

  const calculateBrandTotals = () => {
    const brandTotals = {};
    rows.forEach(row => {
      if (row.brand_id) {
        const product = getProductDetails(row.brand_id);
        if (product) {
          if (!brandTotals[product.brand_name]) {
            brandTotals[product.brand_name] = { quantity: 0, pts: 0, mrp: 0 };
          }
          brandTotals[product.brand_name].quantity += parseInt(row.quantity) || 0;
          brandTotals[product.brand_name].pts += calculateRowPTS(row);
          brandTotals[product.brand_name].mrp += calculateRowMRP(row);
        }
      }
    });
    return brandTotals;
  };

  const downloadExcel = async () => {
    if (rows.length === 0) {
      alert('Please add at least one row before downloading');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PTS Calculator');

    // Header
    worksheet.columns = [
      { header: 'Brand', key: 'brand', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 12 },
      { header: 'PTS per Unit', key: 'pts_per_unit', width: 15 },
      { header: 'Total PTS', key: 'total_pts', width: 15 },
      { header: 'MRP per Unit', key: 'mrp_per_unit', width: 15 },
      { header: 'Total MRP', key: 'total_mrp', width: 15 }
    ];

    // Add data rows
    rows.forEach(row => {
      const product = getProductDetails(row.brand_id);
      if (product) {
        worksheet.addRow({
          brand: product.brand_name,
          quantity: row.quantity,
          pts_per_unit: product.pts_excl_gst,
          total_pts: calculateRowPTS(row),
          mrp_per_unit: product.mrp,
          total_mrp: calculateRowMRP(row)
        });
      }
    });

    // Add brand wise summary
    worksheet.addRow({});
    worksheet.addRow({ brand: 'BRAND WISE SUMMARY' });
    
    const brandTotals = calculateBrandTotals();
    Object.entries(brandTotals).forEach(([brand, totals]) => {
      worksheet.addRow({
        brand: brand,
        quantity: totals.quantity,
        total_pts: totals.pts,
        total_mrp: totals.mrp
      });
    });

    // Add totals
    worksheet.addRow({});
    worksheet.addRow({
      brand: 'TOTAL',
      quantity: rows.reduce((sum, row) => sum + (parseInt(row.quantity) || 0), 0),
      total_pts: totalPTS,
      total_mrp: totalMRP
    });

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `PTS_Calculator_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  const brandTotals = calculateBrandTotals();

  return (
    <div className="calculator">
      <div className="calculator-container">
        <div className="section">
          <h2>Add Products</h2>
          
          <div className="table-wrapper">
            <table className="calculator-table">
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Quantity</th>
                  <th>PTS per Unit</th>
                  <th>Total PTS</th>
                  <th>MRP per Unit</th>
                  <th>Total MRP</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => {
                  const product = getProductDetails(row.brand_id);
                  return (
                    <tr key={row.id}>
                      <td>
                        <select 
                          value={row.brand_id} 
                          onChange={(e) => updateRow(row.id, 'brand_id', e.target.value)}
                          className="select-input"
                        >
                          <option value="">-- Select Brand --</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.brand_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input 
                          type="number" 
                          min="1"
                          value={row.quantity}
                          onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                          className="input-field"
                        />
                      </td>
                      <td className="amount">
                        {product ? product.pts_excl_gst.toFixed(2) : '-'}
                      </td>
                      <td className="amount font-bold">
                        {calculateRowPTS(row).toFixed(2)}
                      </td>
                      <td className="amount">
                        {product ? product.mrp.toFixed(2) : '-'}
                      </td>
                      <td className="amount font-bold">
                        {calculateRowMRP(row).toFixed(2)}
                      </td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => removeRow(row.id)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button className="add-btn" onClick={addRow}>
            + Add Row
          </button>
        </div>

        {rows.length > 0 && (
          <>
            <div className="section">
              <h2>Brand Wise Summary</h2>
              <div className="summary-table-wrapper">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th>Brand</th>
                      <th>Total Quantity</th>
                      <th>Total PTS</th>
                      <th>Total MRP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(brandTotals).map(([brand, totals], idx) => (
                      <tr key={idx}>
                        <td>{brand}</td>
                        <td className="amount">{totals.quantity}</td>
                        <td className="amount">{totals.pts.toFixed(2)}</td>
                        <td className="amount">{totals.mrp.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="section totals-section">
              <h2>Grand Totals</h2>
              <div className="totals-grid">
                <div className="total-item">
                  <span className="label">Total Quantity:</span>
                  <span className="value">
                    {rows.reduce((sum, row) => sum + (parseInt(row.quantity) || 0), 0)}
                  </span>
                </div>
                <div className="total-item">
                  <span className="label">Total PTS:</span>
                  <span className="value">₹ {totalPTS.toFixed(2)}</span>
                </div>
                <div className="total-item">
                  <span className="label">Total MRP:</span>
                  <span className="value">₹ {totalMRP.toFixed(2)}</span>
                </div>
              </div>

              <button className="download-btn" onClick={downloadExcel}>
                📥 Download as Excel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Calculator;
