const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database(path.join(__dirname, 'pts_calculator.db'), (err) => {
  if (err) console.error('Database opening error: ', err);
  else console.log('Database opened successfully');
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Products/Brands table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_name TEXT UNIQUE NOT NULL,
      pts_excl_gst REAL NOT NULL,
      mrp REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) console.error('Error creating products table:', err);
    });

    // Admin users table
    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) console.error('Error creating admin_users table:', err);
    });

    // Seed initial products from provided data
    seedProducts();
    
    // Create default admin if doesn't exist
    createDefaultAdmin();
  });
}

function seedProducts() {
  const products = [
    { brand_name: 'AFDURA', pts: 269.49, mrp: 393.00 },
    { brand_name: 'BETHERAN 25 MG', pts: 125.35, mrp: 182.81 },
    { brand_name: 'DUTAGEN SOFGEL CAP 0.5MG 12X3X10S R-UT', pts: 220.50, mrp: 321.56 },
    { brand_name: 'FLOTRAL D 10\'S TAB', pts: 269.49, mrp: 393.00 },
    { brand_name: 'FLOTRAL TABLETS', pts: 247.50, mrp: 360.94 },
    { brand_name: 'FLOTRAL TAB 10 MG 30\'S', pts: 406.93, mrp: 593.44 },
    { brand_name: 'MYFOS', pts: 327.09, mrp: 477.00 },
    { brand_name: 'NIFTRAN 100 MG 10S', pts: 63.29, mrp: 92.29 },
    { brand_name: 'NIFTRAN 100 MG 30S', pts: 189.86, mrp: 276.88 },
    { brand_name: 'NOCULI B6 ORAL LIQUID', pts: 140.78, mrp: 205.31 },
    { brand_name: 'NOCULI ORAL SOLUTION 450ML IN', pts: 142.72, mrp: 208.13 },
    { brand_name: 'NOCULI ORAL SOLUTION 500ML', pts: 153.64, mrp: 224.06 },
    { brand_name: 'NOCULI TABLETS 10X10\'S', pts: 46.93, mrp: 68.44 },
    { brand_name: 'ROLIFLO OD 2', pts: 180.65, mrp: 263.44 },
    { brand_name: 'ROLIFLO OD 4', pts: 252.00, mrp: 367.50 },
    { brand_name: 'ROLITEN OD 2', pts: 127.93, mrp: 186.56 },
    { brand_name: 'ROLITEN OD 4', pts: 256.50, mrp: 374.06 },
    { brand_name: 'ROLITEN TABLETS 1 MG (3X3X10\'S)', pts: 76.50, mrp: 111.56 },
    { brand_name: 'ROLITEN TABLETS 2 MG (3X3X10\'S)', pts: 133.07, mrp: 194.06 },
    { brand_name: 'SILODAL 4MG CAPSULES', pts: 135.64, mrp: 197.81 },
    { brand_name: 'SILODAL 8', pts: 218.74, mrp: 319.00 },
    { brand_name: 'SILODAL D 8', pts: 322.29, mrp: 470.00 },
    { brand_name: 'SILODAL D4 CAPSULES', pts: 186.43, mrp: 271.88 },
    { brand_name: 'SILODAL M 25 TABLETS 10\'S', pts: 302.15, mrp: 440.63 },
    { brand_name: 'SILODAL M 50 TABLETS 10\'S', pts: 366.43, mrp: 534.38 },
    { brand_name: 'SILODAL T CAPSULES', pts: 306.86, mrp: 446.25 },
    { brand_name: 'SOLITEN ORAL SOLUTION 60ML', pts: 257.14, mrp: 375.00 },
    { brand_name: 'SOLITEN TABLETS 10 MG 3X10\'S', pts: 329.14, mrp: 480.00 },
    { brand_name: 'SOLITEN TABLETS 5 MG 3X10\'S', pts: 268.72, mrp: 391.88 }
  ];

  const insertStmt = db.prepare('INSERT OR IGNORE INTO products (brand_name, pts_excl_gst, mrp) VALUES (?, ?, ?)');
  
  products.forEach(product => {
    insertStmt.run([product.brand_name, product.pts, product.mrp], (err) => {
      if (err) console.error('Error inserting product:', err);
    });
  });
  
  insertStmt.finalize();
}

function createDefaultAdmin() {
  const adminEmail = 'kalyansundarbera@gmail.com';
  const adminPassword = 'Auriel@123'; // Default password - user should change this
  
  db.get('SELECT * FROM admin_users WHERE email = ?', [adminEmail], (err, row) => {
    if (err) {
      console.error('Error checking admin:', err);
      return;
    }
    
    if (!row) {
      const hashedPassword = bcrypt.hashSync(adminPassword, 10);
      db.run('INSERT INTO admin_users (email, password) VALUES (?, ?)', 
        [adminEmail, hashedPassword], 
        (err) => {
          if (err) console.error('Error creating admin user:', err);
          else console.log('Default admin user created');
        }
      );
    }
  });
}

module.exports = { db, initializeDatabase };
