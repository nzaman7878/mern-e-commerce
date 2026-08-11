<p align="center">
  <strong>S N A Z Z Y F I T</strong>
</p>

<h1 align="center">SnazzyFit — Full-Stack MERN E-Commerce Platform</h1>

<p align="center">
  A production-grade, full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js), featuring a customer-facing storefront, a dedicated admin dashboard, and a secure RESTful API backend.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v22-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-v5-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/React-v19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_v8-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vite-v7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Database Architecture](#database-architecture)
- [Authentication & Authorization](#authentication--authorization)
- [API Documentation](#api-documentation)
- [Data Flow](#data-flow)
- [High-Level Design (HLD)](#high-level-design-hld)
- [Low-Level Design (LLD)](#low-level-design-lld)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Technical Decisions](#technical-decisions)
- [Future Improvements](#future-improvements)

---

## Project Overview

**SnazzyFit** is a fashion-focused e-commerce platform designed for a premium shopping experience. It consists of three independently deployable applications sharing a single MongoDB database:

| Application | Port | Description |
| :--- | :--- | :--- |
| **Customer Storefront** (`e-com-frontend`) | `5173` | The public-facing React SPA where customers browse products, manage their cart, place orders, and leave reviews. |
| **Admin Dashboard** (`admin`) | `5174` | A protected React SPA for administrators to manage products, orders, customers, discounts, coupons, categories, and reviews. |
| **Backend API** (`ecom-backend`) | `4000` | The Express.js REST API server handling all business logic, database operations, authentication, payments, and image uploads. |

---

## Key Features

### Customer Storefront
- **Product Browsing** — Filterable, sortable, and searchable product catalog with pagination
- **Product Details** — Image galleries, size selection, ratings & reviews display, related products
- **Shopping Cart** — Persistent cart (localStorage + DB sync), quantity management, size-aware
- **Checkout** — Multi-step checkout with address management, coupon application, and real-time price calculation
- **Payment Integration** — Cash on Delivery (COD), Stripe Checkout
- **Order Tracking** — View order history with real-time status tracking (color-coded statuses)
- **User Profiles** — Editable profile with saved addresses, phone, and account details
- **Product Reviews** — Verified-purchase-only review system with star ratings
- **Dynamic Discounts** — Automatic price reduction based on active sitewide, category, or product-level discounts

### Admin Dashboard
- **Dashboard Analytics** — Real-time KPIs: total products, users, orders, and revenue
- **Product Management** — Full CRUD with multi-image upload (Cloudinary), per-product discount configuration
- **Order Management** — View, filter, search, paginate, and update order statuses
- **Customer Management** — List and remove user accounts
- **Category Management** — Dynamic category and subcategory administration
- **Discount Engine** — Create sitewide, category-level, subcategory-level, or product-specific discounts (percentage or fixed)
- **Coupon System** — Create coupons with expiration, usage limits, minimum order values, and user-specific eligibility
- **Review Moderation** — View and delete reviews for content moderation

### Backend / Security
- **JWT Authentication** — Stateless token-based auth for users and admins
- **Password Hashing** — bcrypt with salt rounds
- **Security Hardening** — Helmet (HTTP headers), rate limiting, NoSQL injection sanitization, XSS prevention
- **Image CDN** — Cloudinary integration for optimized product image hosting
- **Server-Side Price Calculation** — All order totals computed on the backend to prevent price tampering

---

## Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Runtime** | React | 19.1 | UI component library |
| **Routing** | React Router | 7.x | Client-side routing |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **Bundler** | Vite | 7.x | Development server & build tool |
| **HTTP Client** | Axios | 1.11 | API communication |
| **Notifications** | React Toastify | 11.x | Toast notifications |
| **Backend Runtime** | Node.js | 22.x | Server-side JavaScript |
| **Framework** | Express.js | 5.1 | REST API framework |
| **Database** | MongoDB | — | NoSQL document store |
| **ODM** | Mongoose | 8.16 | MongoDB object modeling |
| **Auth** | JSON Web Tokens | 9.x | Stateless authentication |
| **Password Security** | bcrypt | 6.x | Password hashing |
| **Validation** | validator.js | 13.x | Input validation |
| **Image Storage** | Cloudinary | 2.7 | Cloud image hosting & CDN |
| **File Uploads** | Multer | 2.x | Multipart form data parsing |
| **Payments** | Stripe | 18.x | Online payment processing |
| **Security** | Helmet | 8.x | HTTP header security |
| **Rate Limiting** | express-rate-limit | 8.x | API abuse prevention |
| **Sanitization** | express-mongo-sanitize, xss-clean | — | NoSQL injection & XSS prevention |

---

## System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        SF["Customer Storefront<br/>(React + Vite — :5173)"]
        AD["Admin Dashboard<br/>(React + Vite — :5174)"]
    end

    subgraph Server["Server Layer"]
        API["Express.js API Server<br/>(:4000)"]
        MW["Middleware Stack<br/>(Helmet, Rate Limit,<br/>Sanitization, Auth)"]
    end

    subgraph Data["Data Layer"]
        DB[("MongoDB Atlas")]
        CLD["Cloudinary CDN"]
    end

    subgraph External["External Services"]
        STRIPE["Stripe API"]
    end

    SF -- "REST API (Axios)" --> API
    AD -- "REST API (Axios)" --> API
    API --> MW
    MW --> DB
    API -- "Image Upload" --> CLD
    API -- "Payment Session" --> STRIPE
    STRIPE -- "Webhook / Redirect" --> SF
```

---

## Project Structure

```
mern-e-commerce/
├── ecom-backend/                  # Express.js REST API
│   ├── config/
│   │   ├── cloudinary.js          # Cloudinary SDK configuration
│   │   └── mongoDB.js             # Mongoose connection setup
│   ├── controllers/
│   │   ├── adminController.js     # Dashboard stats, user management
│   │   ├── cartController.js      # Cart CRUD operations
│   │   ├── categoryController.js  # Category CRUD
│   │   ├── checkoutController.js  # Server-side price calculation engine
│   │   ├── couponController.js    # Coupon CRUD
│   │   ├── discountController.js  # Discount CRUD & active discount queries
│   │   ├── orderController.js     # Order placement (COD, Stripe), status mgmt
│   │   ├── productController.js   # Product CRUD with discount application
│   │   ├── reviewController.js    # Review CRUD with purchase verification
│   │   └── userController.js      # Auth (login, register, admin), profile mgmt
│   ├── middleware/
│   │   ├── adminAuth.js           # JWT-based admin authorization
│   │   ├── authUser.js            # JWT-based user authentication
│   │   └── multer.js              # File upload configuration
│   ├── models/
│   │   ├── categoryModel.js       # Category/SubCategory schema
│   │   ├── couponModel.js         # Coupon schema with eligibility rules
│   │   ├── discountModel.js       # Flexible discount targeting schema
│   │   ├── orderModel.js          # Order schema
│   │   ├── productModel.js        # Product schema with indexes
│   │   ├── reviewModel.js         # Review schema (one per user per product)
│   │   └── userModel.js           # User schema with addresses & cart
│   ├── routes/
│   │   ├── adminRoute.js          # /api/admin/*
│   │   ├── cartRoute.js           # /api/cart/*
│   │   ├── categoryRoute.js       # /api/category/*
│   │   ├── couponRoute.js         # /api/coupons/*
│   │   ├── discountRoute.js       # /api/discounts/*
│   │   ├── orderRoute.js          # /api/order/*
│   │   ├── productRoute.js        # /api/product/*
│   │   ├── reviewRoute.js         # /api/reviews/*
│   │   └── userRoute.js           # /api/user/*
│   ├── server.js                  # Application entry point
│   └── package.json
│
├── e-com-frontend/                # Customer-facing React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── BestSeller.jsx     # Bestseller product carousel
│   │   │   ├── CartTotal.jsx      # Cart summary with coupon support
│   │   │   ├── Footer.jsx         # Site footer
│   │   │   ├── Hero.jsx           # Landing page hero banner
│   │   │   ├── LatestCollection.jsx # New arrivals grid
│   │   │   ├── Navbar.jsx         # Navigation with cart badge
│   │   │   ├── NewsletterBox.jsx  # Email newsletter signup
│   │   │   ├── OurPolicy.jsx      # Policy info cards
│   │   │   ├── ProductItem.jsx    # Product card component
│   │   │   ├── RelatedProducts.jsx # Related products section
│   │   │   ├── SearchBar.jsx      # Global search overlay
│   │   │   ├── Skeleton.jsx       # Loading skeleton component
│   │   │   └── Title.jsx          # Section title component
│   │   ├── context/
│   │   │   └── ShopContext.jsx    # Global state (cart, auth, products)
│   │   ├── pages/
│   │   │   ├── About.jsx          # About page
│   │   │   ├── Cart.jsx           # Shopping cart page
│   │   │   ├── Collection.jsx     # Product listing with filters
│   │   │   ├── Contact.jsx        # Contact page
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Journal.jsx        # Blog/journal page
│   │   │   ├── Login.jsx          # Login & registration
│   │   │   ├── Orders.jsx         # Order history & tracking
│   │   │   ├── PlaceOrder.jsx     # Checkout flow
│   │   │   ├── Product.jsx        # Product detail page
│   │   │   ├── Profile.jsx        # User profile management
│   │   │   └── Verify.jsx         # Stripe payment verification
│   │   ├── App.jsx                # Route definitions
│   │   └── main.jsx               # React entry point
│   └── package.json
│
├── admin/                         # Admin dashboard React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx          # Admin login form
│   │   │   ├── Navbar.jsx         # Admin top bar
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   └── Skeleton.jsx       # Loading skeleton
│   │   ├── pages/
│   │   │   ├── Add.jsx            # Add new product
│   │   │   ├── Categories.jsx     # Category management
│   │   │   ├── Coupons.jsx        # Coupon management
│   │   │   ├── Customers.jsx      # Customer list & management
│   │   │   ├── Dashboard.jsx      # Analytics dashboard
│   │   │   ├── Discounts.jsx      # Discount rule management
│   │   │   ├── Edit.jsx           # Edit existing product
│   │   │   ├── List.jsx           # Product listing (admin)
│   │   │   ├── Orders.jsx         # Order management
│   │   │   └── Reviews.jsx        # Review moderation
│   │   └── App.jsx                # Admin route definitions
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Database Architecture

### Entity-Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        object cartData
        string phone
        array addresses
    }

    PRODUCT ||--o{ REVIEW : has
    PRODUCT {
        ObjectId _id PK
        string name
        string description
        number price
        array image
        string category
        string subCategory
        array sizes
        boolean bestseller
        number averageRating
        number totalReviews
        date date
    }

    ORDER {
        ObjectId _id PK
        string userId FK
        array items
        number amount
        object address
        string status
        string paymentMethod
        boolean payment
        number date
    }

    REVIEW {
        ObjectId _id PK
        string userId FK
        string productId FK
        string userName
        number rating
        string reviewText
    }

    DISCOUNT {
        ObjectId _id PK
        string name
        string type
        number value
        string targetType
        array targetIds
        date startDate
        date endDate
        boolean isActive
    }

    COUPON {
        ObjectId _id PK
        string code UK
        string type
        number value
        date expirationDate
        number minOrderValue
        number usageLimit
        number usedCount
        array eligibleUsers
        boolean isActive
    }

    CATEGORY {
        ObjectId _id PK
        string name UK
        string type
    }
```

### Schema Details

| Collection | Indexes | Key Constraints |
| :--- | :--- | :--- |
| **users** | `email` (unique) | Password stored as bcrypt hash; `select: false` prevents accidental exposure |
| **products** | `{category, subCategory}`, `{bestseller}`, `{price}` | Category enum: `Men`, `Women`, `Kids`; SubCategory enum: `Topwear`, `Bottomwear`, `Winterwear`; Sizes enum: `XS`–`XXL` |
| **orders** | — | Status enum: `Order Placed` → `Packing` → `Shipped` → `Out for delivery` → `Delivered` |
| **reviews** | `{userId, productId}` (unique compound) | One review per user per product; user must have a `Delivered` order for the product |
| **discounts** | — | Target types: `sitewide`, `category`, `subCategory`, `product`; Discount types: `percentage`, `fixed` |
| **coupons** | `code` (unique) | Stored uppercase; supports usage limits, min order values, and user-specific eligibility |
| **categories** | `name` (unique) | Type enum: `category`, `subCategory` |

---

## Authentication & Authorization

The application uses a dual-auth model: one for customers and one for the admin.

```mermaid
sequenceDiagram
    participant C as Client
    participant API as Express API
    participant MW as Auth Middleware
    participant DB as MongoDB

    Note over C, DB: User Registration
    C->>API: POST /api/user/register {name, email, password}
    API->>API: Validate email & password (≥8 chars)
    API->>API: Hash password (bcrypt, 10 salt rounds)
    API->>DB: Save new user document
    DB-->>API: User saved
    API->>API: Sign JWT with {id: user._id}
    API-->>C: {success: true, token}

    Note over C, DB: User Login
    C->>API: POST /api/user/login {email, password}
    API->>DB: Find user by email (select +password)
    DB-->>API: User document
    API->>API: bcrypt.compare(password, hash)
    API->>API: Sign JWT with {id: user._id}
    API-->>C: {success: true, token, user}

    Note over C, DB: Authenticated Request
    C->>API: POST /api/cart/add (Header: token)
    API->>MW: authUser middleware
    MW->>MW: jwt.verify(token, JWT_SECRET)
    MW->>MW: Inject userId into req.body
    MW->>API: next()
    API->>DB: Perform operation
    DB-->>API: Result
    API-->>C: Response
```

### Auth Model Comparison

| Aspect | Customer Auth (`authUser`) | Admin Auth (`adminAuth`) |
| :--- | :--- | :--- |
| **Token Payload** | `{ id: userId }` (object) | `email + password` concatenation (string) |
| **Verification** | Decode JWT → extract `id` → inject into `req.body.userId` | Decode JWT → compare against `ADMIN_EMAIL + ADMIN_PASSWORD` env vars |
| **Credential Source** | MongoDB `users` collection | Environment variables only |
| **Session Storage** | `localStorage` on client | `localStorage` on admin client |

### Security Middleware Pipeline

```
Request → express.json() → CORS → Helmet → NoSQL Sanitization → XSS Clean → Rate Limit (500 req/15min) → Route Handler
```

---

## API Documentation

### Authentication

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/user/register` | — | Register a new customer account |
| `POST` | `/api/user/login` | — | Customer login |
| `POST` | `/api/user/admin` | — | Admin login |

### User Profile

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/user/profile/get` | User | Get authenticated user's profile |
| `POST` | `/api/user/profile/update` | User | Update profile (name, email, password, phone, addresses) |

### Products

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/product/list` | — | List products with filtering, sorting, pagination |
| `GET` | `/api/product/single?productId=<id>` | — | Get single product details with discount info |
| `POST` | `/api/product/multiple` | — | Get multiple products by IDs (used for cart) |
| `POST` | `/api/product/add` | Admin | Add product with images (multipart/form-data) |
| `POST` | `/api/product/update` | Admin | Update product with optional new images |
| `POST` | `/api/product/remove` | Admin | Delete a product |

#### Product List Query Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Items per page (0 = all) |
| `search` | String | Case-insensitive name search |
| `category` | String | Comma-separated: `Men,Women,Kids` |
| `subCategory` | String | Comma-separated: `Topwear,Bottomwear,Winterwear` |
| `sortType` | String | `low - high` or `high - low` |
| `bestseller` | Boolean | Filter bestsellers only |

### Cart

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/cart/add` | User | Add item to cart |
| `POST` | `/api/cart/update` | User | Update item quantity |
| `POST` | `/api/cart/get` | User | Get user's cart data |
| `POST` | `/api/cart/calculate` | User | Server-side cart total calculation with discounts & coupons |

### Orders

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/order/place` | User | Place order with COD |
| `POST` | `/api/order/stripe` | User | Place order with Stripe |
| `POST` | `/api/order/razorpay` | User | Place order with Razorpay (placeholder) |
| `POST` | `/api/order/verifyStripe` | User | Verify Stripe payment callback |
| `POST` | `/api/order/userorders` | User | Get authenticated user's orders |
| `POST` | `/api/order/list` | Admin | List all orders |
| `POST` | `/api/order/status` | Admin | Update order status |

### Reviews

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews/product/:productId` | — | Get reviews for a product |
| `POST` | `/api/reviews/can-review` | User | Check if user can review a product |
| `POST` | `/api/reviews/add` | User | Submit a review (verified purchase only) |
| `POST` | `/api/reviews/update` | User | Update own review |
| `POST` | `/api/reviews/delete` | User | Delete own review |
| `POST` | `/api/reviews/admin/all` | Admin | List all reviews |
| `POST` | `/api/reviews/admin/delete` | Admin | Admin delete any review |

### Discounts

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/discounts/active` | — | List currently active discounts |
| `GET` | `/api/discounts/list` | Admin | List all discounts |
| `GET` | `/api/discounts/product/:id` | Admin | Get discount for specific product |
| `POST` | `/api/discounts/add` | Admin | Create discount rule |
| `POST` | `/api/discounts/update` | Admin | Update discount rule |
| `POST` | `/api/discounts/delete` | Admin | Delete discount rule |

### Coupons

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/coupons/list` | Admin | List all coupons |
| `POST` | `/api/coupons/add` | Admin | Create coupon |
| `POST` | `/api/coupons/update` | Admin | Update coupon |
| `POST` | `/api/coupons/delete` | Admin | Delete coupon |

### Categories

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/category/list` | — | List all categories (public) |
| `POST` | `/api/category/add` | Admin | Add category or subcategory |
| `POST` | `/api/category/remove` | Admin | Remove category or subcategory |

### Admin

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin | Get dashboard statistics (KPIs, recent orders) |
| `GET` | `/api/admin/users` | Admin | List all users |
| `POST` | `/api/admin/user/remove` | Admin | Delete a user account |

---

## Data Flow

### Checkout & Order Placement Flow

```mermaid
sequenceDiagram
    participant U as Customer
    participant FE as React Frontend
    participant API as Express Backend
    participant CE as Checkout Engine
    participant DB as MongoDB
    participant S as Stripe

    U->>FE: Click "Place Order"
    FE->>API: POST /api/order/place or /stripe<br/>{items, address, couponCode}

    API->>CE: calculateOrderTotals(items, coupon, userId)
    CE->>DB: Fetch product prices from DB
    CE->>DB: Fetch active discounts
    CE->>CE: Apply best discount per item
    CE->>DB: Validate coupon (active, not expired,<br/>usage limit, min order, user eligibility)
    CE->>CE: Calculate: baseTotal - discounts - coupon = finalTotal
    CE-->>API: Return {finalTotal, finalItems, couponApplied}

    alt COD Order
        API->>DB: Save order (payment: false)
        API->>DB: Increment coupon usedCount
        API->>DB: Clear user cart
        API-->>FE: {success: true}
    else Stripe Order
        API->>DB: Save order (payment: false)
        API->>S: Create Checkout Session
        S-->>API: {session_url}
        API-->>FE: {session_url}
        FE->>S: Redirect to Stripe Checkout
        S-->>FE: Redirect to /verify?success=true&orderId=X
        FE->>API: POST /api/order/verifyStripe
        API->>DB: Update order (payment: true)
        API->>DB: Clear user cart
    end
```

### Discount Application Pipeline

```mermaid
flowchart LR
    A["Product Requested"] --> B["Fetch Active Discounts<br/>(isActive=true, within date range)"]
    B --> C{"For each discount"}
    C --> D{"Target Type?"}
    D -- "sitewide" --> E["Applies to all"]
    D -- "category" --> F["Match product.category ∈ targetIds"]
    D -- "subCategory" --> G["Match product.subCategory ∈ targetIds"]
    D -- "product" --> H["Match product._id ∈ targetIds"]
    E & F & G & H --> I["Calculate discount amount<br/>(percentage or fixed)"]
    I --> J["Keep best (highest) discount"]
    J --> K["Return product with<br/>originalPrice, price, discountInfo"]
```

### Cart Persistence Strategy

```mermaid
flowchart TB
    A["User adds item to cart"] --> B{"User logged in?"}
    B -- "Yes" --> C["Update React state"]
    C --> D["Sync to localStorage"]
    D --> E["POST /api/cart/add (async)"]
    E --> F["Update user.cartData in MongoDB"]
    B -- "No" --> G["Update React state"]
    G --> H["Persist to localStorage only"]

    I["Page Reload / App Init"] --> J{"Token in localStorage?"}
    J -- "Yes" --> K["Fetch cart from MongoDB"]
    K --> L["Hydrate React state"]
    J -- "No" --> M["Load cart from localStorage"]
    M --> L
```

---

## High-Level Design (HLD)

```mermaid
graph TB
    subgraph Presentation["Presentation Tier"]
        SF["Storefront SPA<br/>(React 19 + Vite 7 + Tailwind 4)"]
        AD["Admin SPA<br/>(React 19 + Vite 7 + Tailwind 4)"]
    end

    subgraph Application["Application Tier"]
        GW["API Gateway<br/>(Express 5)"]
        AUTH["Auth Module<br/>(JWT + bcrypt)"]
        SEC["Security Module<br/>(Helmet, Rate Limit,<br/>Sanitize)"]
        BL["Business Logic"]
    end

    subgraph Business["Business Logic Modules"]
        PM["Product Module"]
        OM["Order Module"]
        CM["Cart Module"]
        DM["Discount Engine"]
        RM["Review Module"]
        COUP["Coupon Module"]
        UM["User Module"]
        CAT["Category Module"]
    end

    subgraph Data["Data Tier"]
        DB[("MongoDB Atlas<br/>(7 Collections)")]
    end

    subgraph External["External Services"]
        CLD["Cloudinary<br/>(Image CDN)"]
        STR["Stripe<br/>(Payments)"]
    end

    SF & AD --> GW
    GW --> SEC --> AUTH --> BL
    BL --> Business
    Business --> DB
    PM --> CLD
    OM --> STR
    DM --> PM
    DM --> OM
    COUP --> OM
```

### Key Architectural Characteristics

| Characteristic | Implementation |
| :--- | :--- |
| **Monorepo** | Single repository with three independently deployable apps |
| **Stateless API** | JWT-based auth; no server-side sessions |
| **Server-Side Price Integrity** | All prices calculated from DB on the backend; frontend amounts are display-only |
| **Optimistic UI** | Cart updates are reflected instantly in the UI, then synced to the backend |
| **Layered Security** | 5-layer middleware pipeline: JSON parsing → CORS → Helmet → Sanitization → Rate Limiting |

---

## Low-Level Design (LLD)

### Component Architecture — Storefront

```mermaid
graph TB
    App["App.jsx<br/>(Routes)"]
    SC["ShopContext<br/>(Global State)"]

    App --> Home
    App --> Collection
    App --> Product
    App --> Cart
    App --> PlaceOrder
    App --> Orders
    App --> Profile
    App --> Login
    App --> Verify

    SC -.->|provides| App

    subgraph SharedComponents["Shared Components"]
        Navbar
        Footer
        SearchBar
        ProductItem
        CartTotal
        Title
        Skeleton
    end

    subgraph HomeComponents["Home Page Components"]
        Hero
        LatestCollection
        BestSeller
        OurPolicy
        NewsletterBox
    end

    Home --> Hero
    Home --> LatestCollection
    Home --> BestSeller
    Home --> OurPolicy
    Home --> NewsletterBox
    Collection --> ProductItem
    Product --> RelatedProducts
    RelatedProducts --> ProductItem

    App --> Navbar
    App --> Footer
    App --> SearchBar
```

### ShopContext State Shape

```javascript
{
  products: Product[],       // Loaded product catalog
  currency: "₹",            // Display currency symbol
  delivery_fee: 10,          // Flat delivery charge
  search: string,            // Active search query
  showSearch: boolean,       // Search bar visibility
  cartItems: {               // Cart structure: { [productId]: { [size]: quantity } }
    "product_id_1": { "M": 2, "L": 1 },
    "product_id_2": { "S": 1 }
  },
  token: string,             // JWT auth token
  userData: User | null,     // Authenticated user profile
  navigate: Function,        // React Router navigate
  backendUrl: string         // API base URL from env
}
```

### Backend Controller Flow — `addProduct`

```mermaid
flowchart TD
    A["POST /api/product/add"] --> B["adminAuth middleware<br/>(verify JWT)"]
    B --> C["multer middleware<br/>(parse image1-4)"]
    C --> D["Extract fields from req.body"]
    D --> E{"Images provided?"}
    E -- "No" --> F["Return 400 error"]
    E -- "Yes" --> G["Upload each image<br/>to Cloudinary"]
    G --> H["Construct productData"]
    H --> I["Save to MongoDB"]
    I --> J{"Discount fields<br/>provided?"}
    J -- "Yes" --> K["Create Discount<br/>(targetType: product)"]
    J -- "No" --> L["Return success"]
    K --> L
```

### Order Status State Machine

```mermaid
stateDiagram-v2
    [*] --> OrderPlaced: Customer places order
    OrderPlaced --> Packing: Admin updates status
    Packing --> Shipped: Admin updates status
    Shipped --> OutForDelivery: Admin updates status
    OutForDelivery --> Delivered: Admin updates status
    Delivered --> [*]

    note right of Delivered
        On status = "Delivered":
        order.payment = true
        (auto-set by backend)
    end note
```

---

## Installation & Setup

### Prerequisites

- **Node.js** ≥ 18.x (project uses v22)
- **npm** ≥ 9.x
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account ([free tier](https://cloudinary.com/))
- **Stripe** account ([test mode](https://stripe.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/nzaman7878/mern-e-commerce.git
cd mern-e-commerce
```

### 2. Install Dependencies

```bash
# Backend
cd ecom-backend
npm install

# Frontend (Customer Storefront)
cd ../e-com-frontend
npm install

# Admin Dashboard
cd ../admin
npm install
```

### 3. Configure Environment Variables

Create `.env` files as described in the [Environment Variables](#environment-variables) section.

### 4. Start Development Servers

Open three terminal windows:

```bash
# Terminal 1 — Backend API
cd ecom-backend
npm run dev          # Starts on http://localhost:4000

# Terminal 2 — Customer Storefront
cd e-com-frontend
npm run dev          # Starts on http://localhost:5173

# Terminal 3 — Admin Dashboard
cd admin
npm run dev          # Starts on http://localhost:5174
```

---

## Environment Variables

### Backend (`ecom-backend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `CLOUDINARY_NAME` | Cloudinary cloud name | `dxxxxxxx` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_SECRET_KEY` | Cloudinary API secret | `abcdefghijklmnopqrstuvwx` |
| `JWT_SECRET` | Secret key for JWT signing | `your-strong-secret-key` |
| `ADMIN_EMAIL` | Admin login email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin login password | `securepassword` |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-side) | `sk_test_...` |
| `PORT` | Server port (optional) | `4000` |

### Frontend (`e-com-frontend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | Backend API base URL | `http://localhost:4000` |

### Admin (`admin/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | Backend API base URL | `http://localhost:4000` |

> **Security Note:** All `.env` files are excluded from version control via `.gitignore`. Never commit secrets to the repository.

---

## Development Workflow

```mermaid
flowchart LR
    A["Local Dev"] --> B["Feature Branch"]
    B --> C["Code Changes"]
    C --> D["Test Locally<br/>(3 dev servers)"]
    D --> E{"All working?"}
    E -- "No" --> C
    E -- "Yes" --> F["Git Commit"]
    F --> G["Push to GitHub"]
    G --> H["Deploy"]
```

### Scripts

| App | Script | Description |
| :--- | :--- | :--- |
| `ecom-backend` | `npm run dev` | Start with nodemon (auto-restart) |
| `ecom-backend` | `npm start` | Start production server |
| `e-com-frontend` | `npm run dev` | Start Vite dev server (HMR) |
| `e-com-frontend` | `npm run build` | Production build to `dist/` |
| `admin` | `npm run dev` | Start Vite dev server (HMR) |
| `admin` | `npm run build` | Production build to `dist/` |

---

## Deployment

### Backend (Node.js)

Deployable to any Node.js hosting platform:

1. Set all environment variables on the hosting platform
2. Run `npm install` followed by `npm start`
3. Ensure the `PORT` environment variable is configured if the platform requires it

**Recommended platforms:** Render, Railway, Fly.io, AWS EC2, DigitalOcean

### Frontend & Admin (Static Sites)

Both React apps produce static builds:

```bash
cd e-com-frontend && npm run build   # Output: dist/
cd admin && npm run build            # Output: dist/
```

Deploy the `dist/` folder to any static hosting service. Configure SPA fallback (redirect all routes to `index.html`).

**Recommended platforms:** Vercel, Netlify, Cloudflare Pages, AWS S3 + CloudFront

### Production Checklist

- [ ] Set `NODE_ENV=production` on the backend
- [ ] Use a strong, unique `JWT_SECRET`
- [ ] Configure CORS to allow only your frontend domains
- [ ] Use Stripe **live** keys (not test keys)
- [ ] Enable MongoDB Atlas IP allowlist
- [ ] Set up SSL/TLS for all endpoints
- [ ] Configure proper rate limiting values for production traffic

---

## Technical Decisions

| Decision | Rationale |
| :--- | :--- |
| **Express 5** | Adopted the latest major version for improved async error handling and modern routing conventions. |
| **Server-side price calculation** | All order totals and discount applications are computed on the backend using DB prices, preventing client-side price tampering. |
| **Cart dual-persistence** | Cart is stored in both `localStorage` (for instant offline-first UX) and MongoDB (for cross-device sync), with MongoDB as source of truth for logged-in users. |
| **Compound unique index on reviews** | `{userId, productId}` unique index at the database level enforces one review per user per product, preventing duplicates even under race conditions. |
| **Best discount wins** | When multiple discounts apply to a product, the system selects the one that gives the customer the highest savings, rather than stacking. |
| **Custom sanitization middleware** | Express 5 makes `req.query` read-only. Custom wrappers around `express-mongo-sanitize` and `xss-clean` work around this by mutating individual properties rather than reassigning the object. |
| **Cloudinary for images** | Offloads image storage and transformation to a CDN rather than serving static files from the Node.js process, improving performance and scalability. |
| **Flat delivery charge** | A fixed ₹10 delivery fee is applied at checkout. This simplifies the initial implementation while being easy to extend to weight-based or location-based pricing. |

---

## Future Improvements

- [ ] **Razorpay Integration** — Complete the Razorpay payment gateway (currently a placeholder)
- [ ] **Wishlist** — Allow users to save products for later
- [ ] **Email Notifications** — Order confirmation, shipping updates, and password reset via email
- [ ] **Inventory Management** — Track stock quantities per size and prevent overselling
- [ ] **Image Optimization** — Implement Cloudinary transformations for responsive images (WebP, srcset)
- [ ] **Search Autocomplete** — Debounced, server-side search suggestions
- [ ] **Pagination on Storefront** — Infinite scroll or paginated product listing for large catalogs
- [ ] **Role-Based Access Control** — Support multiple admin roles with granular permissions
- [ ] **Unit & Integration Tests** — Jest + Supertest for the API, React Testing Library for the frontend
- [ ] **CI/CD Pipeline** — Automated testing and deployment via GitHub Actions
- [ ] **Containerization** — Docker Compose setup for consistent development and deployment environments
- [ ] **API Versioning** — Version the REST API (e.g., `/api/v1/`) for backward compatibility

---

<p align="center">
  Built with ❤️ using the MERN Stack
</p>
