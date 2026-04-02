# ShopLocal — Deployment Lesson 2 Demo App

A shopping app that uses **two databases**:
- **MongoDB** — stores products (flexible schema, works in both environments)
- **Supabase (PostgreSQL)** — stores users with register/login (production only)

---

## Prerequisites

- Node.js 20+
- MongoDB running locally (via MongoDB Compass or the `mongod` service)
- A Supabase account (only needed when switching to production)

---

## Setup

### 1. Server

```bash
cd server
npm install
```

The `server/.env` file is already included. Here is what each value means and what you need to do before running:

```bash
# Controls which databases are active.
# "development" = MongoDB only (Supabase skipped)
# "production"  = MongoDB + Supabase both active
NODE_ENV=development

# Your local MongoDB connection — works out of the box if MongoDB is running locally.
# When you migrate to Atlas, replace this with your Atlas URI.
MONGODB_URI=mongodb://127.0.0.1:27017/shopping

# Leave these blank in development — the app will skip Supabase entirely.
# Fill them in when you are ready to switch to production.
SUPABASE_URL=
SUPABASE_ANON_KEY=

# ⚠️ Change this before running — it is used to sign login tokens.
# Any long random string works, e.g. "mySecretKey_abc123_xyz789"
JWT_SECRET=change-this-to-a-long-random-string
```

**Before running locally, the only thing you need to change is `JWT_SECRET`.**
MongoDB is already configured for local development. Supabase is not needed yet.

```bash
npm run dev
```

Server runs at **http://localhost:5000**

### 2. Client

```bash
cd client
npm install
npm run dev
```

Client runs at **http://localhost:5173**

---

## Seeding local MongoDB

Before running the app, insert some sample products into your local MongoDB.

Open MongoDB Compass, connect to `mongodb://127.0.0.1:27017`, create a database called `shopping` and a collection called `products`. Then go to **Add Data → Insert Document** and paste the following:

```json
[
  {
    "name": "Classic White Tee",
    "price": 24.99,
    "category": "Clothing",
    "description": "A comfortable everyday t-shirt",
    "attributes": {
      "colour": "white",
      "sizes": ["S", "M", "L", "XL"],
      "material": "cotton"
    },
    "inStock": true
  },
  {
    "name": "ProBook 14 Laptop",
    "price": 999.99,
    "category": "Electronics",
    "description": "Lightweight laptop for everyday use",
    "attributes": {
      "ram": "16GB",
      "storage": "512GB SSD",
      "os": "Windows 11",
      "screenSize": "14 inch"
    },
    "inStock": true
  },
  {
    "name": "Clean Code",
    "price": 34.99,
    "category": "Books",
    "description": "A handbook of agile software craftsmanship",
    "attributes": {
      "author": "Robert C. Martin",
      "isbn": "978-0132350884",
      "pages": 464,
      "language": "English"
    },
    "inStock": true
  },
  {
    "name": "Running Shoes X200",
    "price": 89.99,
    "category": "Footwear",
    "description": "Lightweight running shoes with cushioned sole",
    "attributes": {
      "colour": "black",
      "sizes": [7, 8, 9, 10, 11],
      "brand": "SpeedFit"
    },
    "inStock": true
  },
  {
    "name": "Wireless Headphones",
    "price": 149.99,
    "category": "Electronics",
    "description": "Over-ear headphones with noise cancellation",
    "attributes": {
      "batteryLife": "30 hours",
      "connectivity": "Bluetooth 5.0",
      "colour": "black"
    },
    "inStock": false
  }
]
```

> Notice how each product has different fields inside `attributes` — this is exactly why MongoDB is a good fit for products.

---

## Environment modes

The app behaves differently depending on `NODE_ENV` in `server/.env`:

| | `development` | `production` |
|---|---|---|
| MongoDB | Local (`localhost:27017`) | Atlas (swap `MONGODB_URI`) |
| Supabase auth | Disabled — section hidden in UI | Enabled — register/login works |
| UI banner | Yellow — Development | Green — Production |

---

## Migrating to production (in-class exercise)

### Step 1 — MongoDB → Atlas

1. Create a free cluster on [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user and whitelist your IP address
3. Click **Connect → Drivers → Node.js** and copy the connection string
4. Add your database name before the `?` in the URI:
```
mongodb+srv://user:password@cluster.mongodb.net/shopping?appName=...
```
5. Replace `MONGODB_URI` in `server/.env` with your Atlas URI

### Step 2 — Supabase (PostgreSQL)

1. Create a project on [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New query** and run:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Go to **Project Settings → API** and copy your **Project URL** and **anon public key**
4. Add them to `server/.env`:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```
5. Change `NODE_ENV=production` in `server/.env`
6. Restart the server — the auth section will unlock in the UI

---

## API endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/env` | Returns current environment info |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/products` | Add a product |
| DELETE | `/api/products/:id` | Delete a product |
| POST | `/api/auth/register` | Register a user (production only) |
| POST | `/api/auth/login` | Login (production only) |

---

## Practice

Now that you have seen how to migrate a MongoDB database to Atlas, do the same with your own project.

1. Fork your mid-term project on GitHub — or if it is only local, make a copy of the folder
2. Open the copy in VS Code
3. Create a new MongoDB Atlas cluster for your mid-term project
4. Get the connection string from Atlas (**Connect → Drivers → Node.js**)
5. Add your database name to the connection string before the `?`
6. Replace your local `MONGODB_URI` in your `.env` file with the Atlas URI
7. Start your server and confirm it connects to Atlas successfully
8. Open MongoDB Compass, connect using the Atlas URI, and verify your collections are visible in the cloud

> Make sure your `.env` file is in `.gitignore` before pushing — your Atlas credentials must never be committed to GitHub.
