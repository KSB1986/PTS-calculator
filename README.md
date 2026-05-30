# Auriel PTS Calculator

A web-based calculator for managing and calculating PTS (Price to Sell) and MRP for Auriel pharmaceutical products.

## Features

- **Calculator**: Add products row by row and calculate brand-wise and total PTS/MRP
- **Excel Export**: Download calculated data as an Excel file
- **Admin Panel**: Manage products with login authentication
- **Admin Features**: 
  - Add new brands with PTS and MRP values
  - Edit existing product information
  - Delete products

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Clone or extract the project**

2. **Install Server Dependencies**
```bash
cd server
npm install
```

3. **Install Client Dependencies**
```bash
cd ../client
npm install
```

### Running the Application

1. **Start the Server** (in a terminal)
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

2. **Start the Client** (in another terminal)
```bash
cd client
npm start
```
The client will open at `http://localhost:3000`

## Admin Login

- **Email**: kalyansundarbera@gmail.com
- **Default Password**: Auriel@123

**Important**: Change the default password after first login in production.

## Project Structure

```
PTS Calculator/
├── server/
│   ├── server.js           # Main server file
│   ├── database.js         # Database setup and initialization
│   ├── package.json        # Server dependencies
│   └── .env               # Environment variables
├── client/
│   ├── public/            # Static files
│   ├── src/
│   │   ├── App.js         # Main App component
│   │   ├── App.css        # Main styling
│   │   └── components/    # React components
│   │       ├── Calculator.js
│   │       ├── AdminLogin.js
│   │       └── AdminPanel.js
│   └── package.json       # Client dependencies
└── README.md             # This file
```

## Available Scripts

### Server
- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with nodemon for development

### Client
- `npm start` - Run the app in development mode
- `npm build` - Build the app for production

## Technologies Used

### Backend
- Node.js
- Express.js
- SQLite3
- JWT (JSON Web Tokens)
- bcryptjs (Password hashing)

### Frontend
- React
- Axios (HTTP client)
- ExcelJS (Excel file generation)
- CSS3

## Features in Detail

### Calculator Page
- Select brands from dropdown
- Add quantity for each product
- Auto-calculates PTS and MRP per unit and total
- Shows brand-wise summary
- Shows grand totals
- Export data to Excel with formatted columns

### Admin Panel
- Login with email and password
- View all products in a table
- Add new products with brand name, PTS, and MRP
- Edit existing products
- Delete products
- All changes are immediately reflected

## Database

The application uses SQLite with two main tables:
- `products` - Stores brand information with PTS and MRP
- `admin_users` - Stores admin credentials

Initial data includes all 29 Auriel product brands provided.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

## Notes

- The calculator is fully responsive and works on mobile devices
- Admin authentication uses JWT tokens for security
- All PTS/MRP calculations are done in real-time
- Excel export includes brand-wise summary and grand totals

## Support

For issues or questions, contact Auriel team.
