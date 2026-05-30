import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

function AdminPanel({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    brand_name: '',
    pts_excl_gst: '',
    mrp: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching products');
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ brand_name: '', pts_excl_gst: '', mrp: '' });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      brand_name: product.brand_name,
      pts_excl_gst: product.pts_excl_gst,
      mrp: product.mrp
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.brand_name || !formData.pts_excl_gst || !formData.mrp) {
      setError('All fields are required');
      return;
    }

    try {
      if (editingId) {
        // Update
        await axios.put(`/api/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Product updated successfully');
      } else {
        // Add new
        await axios.post('/api/products', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Product added successfully');
      }
      
      setShowForm(false);
      setFormData({ brand_name: '', pts_excl_gst: '', mrp: '' });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        setError('Error deleting product');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ brand_name: '', pts_excl_gst: '', mrp: '' });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="panel-container">
        <div className="panel-header">
          <h2>Manage Products</h2>
          <button className="add-product-btn" onClick={handleAddNew}>
            + Add New Product
          </button>
        </div>

        {error && <div className="alert error-alert">{error}</div>}
        {success && <div className="alert success-alert">{success}</div>}

        {showForm && (
          <div className="form-section">
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="brand_name">Brand Name *</label>
                <input
                  id="brand_name"
                  type="text"
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pts">PTS (Excl. GST) *</label>
                  <input
                    id="pts"
                    type="number"
                    step="0.01"
                    value={formData.pts_excl_gst}
                    onChange={(e) => setFormData({ ...formData, pts_excl_gst: e.target.value })}
                    placeholder="Enter PTS"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mrp">MRP *</label>
                  <input
                    id="mrp"
                    type="number"
                    step="0.01"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="Enter MRP"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingId ? 'Update' : 'Add'} Product
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Brand Name</th>
                <th>PTS (Excl. GST)</th>
                <th>MRP</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">No products found</td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id}>
                    <td>{product.brand_name}</td>
                    <td className="amount">₹ {product.pts_excl_gst.toFixed(2)}</td>
                    <td className="amount">₹ {product.mrp.toFixed(2)}</td>
                    <td className="actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
