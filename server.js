const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, initializeDatabase } = require('./database');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initializeDatabase();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.adminId = decoded.id;
    req.adminEmail = decoded.email;
    next();
  });
};

// ============ Authentication Routes ============

// Admin Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  db.get('SELECT * FROM admin_users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!row) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!bcrypt.compareSync(password, row.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: row.id, email: row.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token, email: row.email });
  });
});

// ============ Product Routes ============

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY brand_name', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching products' });
    }
    res.json(rows);
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching product' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(row);
  });
});

// Add new product (Admin only)
app.post('/api/products', verifyToken, (req, res) => {
  const { brand_name, pts_excl_gst, mrp } = req.body;
  
  if (!brand_name || !pts_excl_gst || !mrp) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  db.run(
    'INSERT INTO products (brand_name, pts_excl_gst, mrp) VALUES (?, ?, ?)',
    [brand_name, pts_excl_gst, mrp],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ message: 'Brand already exists' });
        }
        return res.status(500).json({ message: 'Error adding product' });
      }
      res.status(201).json({ id: this.lastID, brand_name, pts_excl_gst, mrp });
    }
  );
});

// Update product (Admin only)
app.put('/api/products/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { brand_name, pts_excl_gst, mrp } = req.body;
  
  if (!brand_name || !pts_excl_gst || !mrp) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  db.run(
    'UPDATE products SET brand_name = ?, pts_excl_gst = ?, mrp = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [brand_name, pts_excl_gst, mrp, id],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ message: 'Brand name already exists' });
        }
        return res.status(500).json({ message: 'Error updating product' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ id, brand_name, pts_excl_gst, mrp });
    }
  );
});

// Delete product (Admin only)
app.delete('/api/products/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting product' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
