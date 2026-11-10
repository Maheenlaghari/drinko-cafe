# Drinko Coffee

Theme and design provided by undiegravity.

## Project Features

* 100 percent viewport immersive hero section with video modal craft pour preview
* Dynamic curated menu with real time category filtering and live search
* Multi page architecture including dedicated Menu, Delivery, Locations, and Account pages
* Flexible order fulfillment with Delivery and Takeaway pickup options at checkout
* Checkout flow with Cash on Delivery and secure card provider handoff
* Customer authentication and login system with persistent profile management
* Complete order history tracker with itemized receipts and order status
* Loyalty stamp card system automatically unlocking free coffee coupon FREECOFFEE after 6 completed orders
* Browser storage persistence for profile, basket, checkout preferences, order history, and loyalty progress
* Full responsive architectural footer with operating hours, store directory, and newsletter
* Global theme system utilizing semantic CSS design tokens for colors and typography
* Backend ready modular architecture with typed data contracts

The current demo stores profile, basket, and checkout state in browser local storage. Replace the storage adapter with the documented API integration when connecting a backend.

## Tech Stack and Versions

* Next.js 16.4.5
* React 19.3.0
* Tailwind CSS 4.0
* TypeScript 5.0
* Lucide React

## Backend API Endpoints

The frontend is structured to consume the following RESTful API endpoints:

* GET /api/v1/navigation : Retrieve main header navigation items
* GET /api/v1/hero : Retrieve hero section banner content and video asset URL
* GET /api/v1/categories : Retrieve active coffee and pastry categories
* GET /api/v1/products : Retrieve menu items with category filtering and pagination
* GET /api/v1/products/:id : Retrieve detailed product information
* GET /api/v1/promotions/active : Retrieve active promotional discount banner data
* GET /api/v1/locations : Retrieve store directory and operating hours
* POST /api/v1/auth/login : User authentication and profile retrieval
* GET /api/v1/users/me/loyalty : Retrieve stamp card progress and unlocked vouchers
* GET /api/v1/orders/history : Retrieve customer order history
* POST /api/v1/coupons/validate : Validate promo codes such as DRINKO20 and FREECOFFEE
* POST /api/v1/orders/checkout : Process cart submission with delivery or takeaway fulfillment

## Checkout Integration

The checkout page sends an order request to `POST /api/v1/orders/checkout`. Set `NEXT_PUBLIC_API_BASE_URL` to the backend origin when it is hosted separately. The request contains customer contact details, fulfillment and destination, product identifiers and quantities, an optional promotion code, order notes, and `cash_on_delivery`, `cash_on_pickup`, or `card` as the payment method.

The backend must validate product availability, calculate all prices and discounts, and create the order. The browser does not send trusted totals. For card payments, the backend must create a hosted payment session and return its HTTPS `checkoutUrl`. Card details are entered by the payment provider and are never collected or stored by this frontend.

Successful Cash on Delivery response:

```json
{
  "orderId": "order_123",
  "paymentStatus": "pending"
}
```

Successful card response:

```json
{
  "orderId": "order_123",
  "paymentStatus": "pending",
  "checkoutUrl": "https://payments.example.com/session/..."
}
```

The checkout UI requires this API before it can place an order. Until the endpoint and payment provider are connected, it reports the connection error and leaves the cart unchanged.
