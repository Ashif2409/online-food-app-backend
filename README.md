# Online Food Delivery Backend

## Description

The Online Food Delivery Backend is a comprehensive backend system designed for an online food delivery platform. The system includes distinct modules for Vendor, Admin, Shopping, Customer, and Delivery functionalities, providing a complete solution for managing food delivery operations.

## Features

- **Vendor Module**: Manage food vendors and their offerings.
- **Admin Module**: Oversee platform operations and manage users and vendors.
- **Shopping Module**: Handle food ordering and cart functionalities.
- **Customer Module**: Allow users to browse, order food, and track deliveries.
- **Delivery Module**: Manage delivery operations and track delivery status.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side operations.
- **Express.js**: Web framework for building the API.
- **JWT**: JSON Web Tokens for secure authentication and authorization.
- **MongoDB**: NoSQL database for data storage.
- **Cloudinary**: Image storage and management.
- **Multer**: Middleware for handling file uploads.
- **Twilio**: OTP-based communication features.

## Installation

1. Clone the repository:
   git clone https://github.com/Ashif2409/onlinefooddel.git
    cd onlinefooddel

2.Install dependencies:
  npm install

3.Build the project:
 npm run dev
 
## Configuration
 Create a .env file in the root directory and add the following environment variables:
  PORT=your_port ,
  MONGO_URI=your_mongodb_connection_string ,
  CLOUDINARY_URL=your_cloudinary_url ,
  TWILIO_ACCOUNT_SID=your_twilio_account_sid ,
  TWILIO_AUTH_TOKEN=your_twilio_auth_token ,
  JWT_SECRET=your_jwt_secret ,

