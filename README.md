# Toko Online API

percobaan request pull pertama

A full-stack e-commerce application built with Node.js, Express, MySQL, and Bootstrap 5.

## Features

- **Product Management**: Create, read, update, delete products with image upload
- **Category Management**: Organize products into categories
- **Cart System**: Add products to cart, manage quantities, calculate totals
- **Checkout System**: Complete orders with automatic stock reduction
- **User Authentication**: JWT-based authentication with role-based access (admin/user)
- **User Profile**: View and update user profile, change password
- **Order History**: View past orders and order details
- **Admin Dashboard**: Sales statistics, order management, user management
- **Search & Filter**: Search products by name/description, filter by category

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: Bootstrap 5, Vanilla JavaScript
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd toko-online-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=toko_online
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

4. Create the database:
```bash
mysql -u your_mysql_user -p
```

Run the SQL commands:
```sql
CREATE DATABASE toko_online;
USE toko_online;
SOURCE database-schema.sql;
```

Or run the schema file directly:
```bash
mysql -u your_mysql_user -p toko_online < database-schema.sql
```

5. Start the application:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Database Schema

The application uses the following tables:

- `users`: User accounts with authentication
- `categories`: Product categories
- `products`: Product information with images
- `carts`: Shopping carts for each user
- `cart_items`: Items in shopping carts
- `orders`: Customer orders
- `order_items`: Items in orders

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (authenticated)
- `PUT /auth/profile` - Update user profile (authenticated)
- `PUT /auth/change-password` - Change password (authenticated)

### Products
- `GET /products` - Get all products
- `POST /products` - Create product (admin only)
- `PUT /products/:id` - Update product (admin only)
- `DELETE /products/:id` - Delete product (admin only)

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (admin only)
- `PUT /categories/:id` - Update category (admin only)
- `DELETE /categories/:id` - Delete category (admin only)

### Cart
- `GET /cart` - Get user's cart
- `POST /cart` - Add item to cart
- `PUT /cart/items/:id` - Update cart item quantity
- `DELETE /cart/items/:id` - Remove item from cart
- `DELETE /cart` - Clear cart
- `POST /cart/checkout` - Checkout cart

### Orders
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update order status (admin only)
- `GET /orders/all/orders` - Get all orders (admin only)

## Default Users

After running the schema, you can create users through the registration page. The first user will have admin privileges if you manually set the role in the database.

To create an admin user manually:
```sql
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2a$10$hashed_password_here', 'admin');
```

## File Structure

```
toko-online-api/
├── public/
│   ├── index.html          # Main application page
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   └── uploads/            # Uploaded product images
├── src/
│   ├── config/
│   │   └── database.js     # Database configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middleware/
│   │   ├── auth.js         # Authentication middleware
│   │   └── upload.js       # Multer configuration
│   └── routes/
│       ├── authRoutes.js
│       ├── cartRoutes.js
│       ├── categoryRoutes.js
│       ├── orderRoutes.js
│       └── productRoutes.js
├── database-schema.sql     # Database schema
├── index.js                # Main application file
├── package.json
└── .env                    # Environment variables
```

## Development

### Running in development mode
```bash
npm start
```

### Running with nodemon (auto-restart on changes)
```bash
npm install -g nodemon
nodemon index.js
```

## Deployment

### Deployment Options

#### 1. VPS (Virtual Private Server)

**Prerequisites:**
- Ubuntu/Debian server
- Node.js installed
- MySQL installed
- Nginx (optional, for reverse proxy)

**Steps:**
1. Clone the repository to your server
2. Install dependencies: `npm install --production`
3. Set up environment variables in `.env`
4. Run the database schema
5. Use PM2 to keep the application running:
```bash
npm install -g pm2
pm2 start index.js --name "toko-online"
pm2 save
pm2 startup
```

#### 2. Heroku

**Prerequisites:**
- Heroku CLI installed
- Heroku account

**Steps:**
1. Login to Heroku: `heroku login`
2. Create a new app: `heroku create your-app-name`
3. Add MySQL add-on: `heroku addons:create cleardb`
4. Set environment variables:
```bash
heroku config:set DB_HOST=your-db-host
heroku config:set DB_USER=your-db-user
heroku config:set DB_PASSWORD=your-db-password
heroku config:set DB_NAME=your-db-name
heroku config:set JWT_SECRET=your-jwt-secret
```
5. Deploy: `git push heroku main`

#### 3. Vercel (Frontend only)

For backend deployment, use VPS or Heroku. Vercel can be used to host the frontend separately.

## Security Considerations

- Change the default JWT_SECRET in production
- Use strong passwords for database users
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs
- Keep dependencies updated

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify the database exists

### File Upload Issues
- Ensure the `uploads/` directory exists and has write permissions
- Check Multer configuration in `src/middleware/upload.js`

### Authentication Issues
- Verify JWT_SECRET is set in `.env`
- Check token expiration (default: 24 hours)

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
