# PTS Calculator - Project Setup Instructions

## Project Overview
Auriel PTS Calculator is a full-stack web application for managing and calculating PTS (Price to Sell) and MRP for pharmaceutical products.

## Initial Setup Status
- ✅ Backend (Node.js/Express) created with SQLite database
- ✅ Frontend (React) created with Calculator and Admin Panel components
- ✅ All 29 Auriel product brands pre-loaded with PTS and MRP data
- ✅ Admin authentication system with JWT tokens
- ⏳ Dependencies installation pending
- ⏳ Server and client startup pending

## Next Steps

1. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start the Backend Server**
   ```bash
   cd server
   npm start
   ```
   Server will run on http://localhost:5000

4. **Start the Frontend Application** (in a new terminal)
   ```bash
   cd client
   npm start
   ```
   Frontend will open at http://localhost:3000

## Admin Login Credentials
- **Email**: kalyansundarbera@gmail.com
- **Password**: Auriel@123

## Key Features Implemented

### Calculator
- Add products row by row with quantity
- Real-time PTS and MRP calculations
- Brand-wise summary
- Grand totals display
- Excel export functionality

### Admin Panel
- Secure login with JWT authentication
- Add new products
- Edit product information
- Delete products
- View all products in table format

## Database
- Pre-populated with 29 Auriel pharmaceutical brands
- Stores admin credentials with bcrypt password hashing
- Automatic schema initialization on first run

## Important Files
- `server/server.js` - Main API server
- `server/database.js` - Database setup and seeding
- `client/src/App.js` - Main React application
- `client/src/components/Calculator.js` - Calculator component
- `client/src/components/AdminPanel.js` - Admin management panel
- `README.md` - Full documentation

## Environment Setup
The `.env` file in the server folder contains necessary configuration. Update `JWT_SECRET` for production.

## Troubleshooting
- Ensure Node.js v14+ is installed
- Check that ports 5000 (backend) and 3000 (frontend) are available
- Clear browser cache if experiencing issues
- Check browser console for any errors
