# Zesty - Grocery Delivery App

Zesty is a full-stack grocery delivery application where users can browse products, add them to the cart, checkout, track orders, rate and comment on products, and interact with an AI-powered chatbot for assistance. The chatbot can answer questions about products, policies, and general app usage.

**Live Demo:** [https://zesty-beta.vercel.app/]

## Features

* Product browsing with categories
* User authentication (signup, login, forgot password)
* Profile editing
* Shopping cart and checkout with Stripe integration
* Order tracking
* AI chatbot for product and policy queries
* Product rating and commenting
* Newsletter subscription
* Image upload and storage with Cloudinary


## Tech Stack

* **Frontend:** React, Tailwind CSS, React Router, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Deployment:** Vercel

## Project Structure

zesty/
│── backend/
│   ├── configs/
│   ├── controllers/
│   ├── data/
│   ├── middlewares/
│   ├── models/
│   ├── public/
│   ├── routes/
│   └── server.js
│
│── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.css
```

## Installation & Setup (For Developers)

1. Clone the repository

#bash
git clone https://github.com/SuryaBatchu22/Zesty_GroceryDeliveryApp.git
cd zesty


### 2. Backend Setup

#bash
cd backend
npm install


Create a `.env` file in `/backend`:

.env
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
NODE_ENV=development

SELLER_EMAIL=your_admin_email
SELLER_PASSWORD=your_admin_password

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

STRIPE_PUBLISHABLE_KEY=xxxx
STRIPE_SECRET_KEY=xxxx
STRIPE_WEBHOOK_SECRET=xxxx

EMAIL_USER=xxxx
EMAIL_PASS=xxxx

BASE_API_URL=http://localhost:4000
JWT_RESET_SECRET=xxxx
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=xxxx


Run the backend:

#bash
npm run server


### 3. Frontend Setup

#bash
cd ../frontend
npm install


Create a `.env` file in `/frontend`:

.env
VITE_CURRENCY=$
VITE_BACKEND_URL=http://localhost:4000


Run the frontend:

#bash
npm run dev

## Contribution

Contributions are welcome.
1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request


## License
This project is licensed under the terms of the [MIT License](LICENSE).

