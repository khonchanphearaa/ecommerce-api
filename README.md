# Ecommerce-API

A full-featured E-Commerce REST API built with Node.js, Express, MongoDB, and JWT authentication. This project covers the complete e-commerce flow including authentication, products, cart, orders, payments, and admin management.

## Project Overview

This backend API is design tp support a modern e-commerce application (Web/Mobile). It follow clean architecture principles and real-world e-commerce logic.

### Main Goals:
- Secure user authentication
- Product & Category management
- Cart & Order processing
- Payment intergration (Bakong static khqr)
- Admin control $ role-based access

## Tech Stack
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Bakong](https://img.shields.io/badge/Bakong-2F2F35?style=for-the-badge&logo=wallet&logoColor=EAFF07)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## Project Stucture
```bash

ecommerce-api
┃  src                           
┃  ├─ config                     
┃  │  ├─ cloudinary.js           
┃  ├─ db.js                   
┃  │  └─ jwt.js                  
┃  ├─ controllers                
┃  │  ├─ auth.controller.js      
┃  │  ├─ cart.controller.js      
┃  │  ├─ category.controller.js  
┃  │  ├─ order.controller.js     
┃  │  ├─ payment.controller.js   
┃  │  └─ product.controller.js   
┃  ├─ middlewares                
┃  │  ├─ auth.middleware.js      
┃  │  └─ upload.js               
┃  ├─ models                     
┃  │  ├─ Cart.js                 
┃  │  ├─ Category.js             
┃  │  ├─ Order.js                
┃  │  ├─ Payment.js              
┃  │  ├─ Product.js              
┃  │  └─ User.js                 
┃  ├─ routes                     
┃  │  ├─ auth.routes.js          
┃  │  ├─ cart.routes.js          
┃  │  ├─ category.routes.js      
┃  │  ├─ order.routes.js         
┃  │  ├─ payment.routes.js       
┃  │  └─ product.routes.js       
┃  ├─ utils                      
┃  │  ├─ crc16.js                
┃  │  └─ generateToken.js        
┃  └─ app.js                     
┃-- .evn 
|-- .gitignore
|-- package.json
|-- helper.doc
|-- README.md
|-- server.js

```
## Authentication Flow
### 1.Register User
- User submit name, email, password
- Password is hashed using bcrypt
- User is saved in MongoDB
- JWT token is generated

### 2.Login User
- Email & Password validation
- Password comparison
- JWT token returned

### 3.Authirization
- Token send via header:

    ```bash
    Authorization: Bearer <token>
    ```

- Middleware verifies token
- User data attached to req.user

## User Role
| Role  | Permissions                    |
| :---- | :----------------------------- |
| User  | Browse, cart, order, pay       |
| Admin | Manage products, users, orders |

Role-based access is endforced via middleware.

## Product Flow
### Admin Actions

1. Create products
2. Upload image (Cloudinary)
3. Update product
4. Delete products

### User Actions
1. View product list
2. View product details
3. Search & fillter products

## Cart & Order Flow
- Cart stored on frontend or database
- User selects product & quantity

## Order Creation Flow
1. User submit cart
2. Backend validation stock
3. Order is created
4. Stock is reduced (After payment success)
5. Order status = ``` pending ```

## Payment Flow (Bakong Khqr)

### Payment Process
1. Create payment intent
2. User completes payment (generate khqr)
3. Payment confirmation
4. Order status updated

### Payment Status
- pending
- paid
- failed

## E-Commerce Lifecycle

```bash
Product(Stock) → Cart(Quantity) → Order(Addrees) → Payment(Bakong Khqr) 
```

## How to Run Project
1. Install Dependencies

    ```bash
    npm install
    ```

2. Setup Enviroment Variables

    ```bash
    PORT=5000
    MONGO_URI=your_mongodb_url
    JWT_SECRET=your_secret_key
    CLOUDINARY_CLOUD_NAME=xxx
    CLOUDINARY_API_KEY=xxx
    CLOUDINARY_API_SECRET=xxx
    STRIPE_SECRET_KEY=xxx
    ```

3. Start Server

    ```bash
    npm run dev
    ```

## API Testing Postman
- Test Auth APIs
- Copy JWT token
- Add token to Authorization header

## Common Issue
- ``` EADDRINUSE ```: Port already is use → stop previous server
- ``` Server error ```: Check MongoDB connection
- ``` Unauthorized ```: Token missing or expired

### Author
Develop BY ``` khon chanphearaa ```

## LICENSE
This project is for learning & development purposes.




