# Blood Donor Finder (MERN)

Find blood donors by blood group and location.

| Layer | Tech |
|---|---|
| Database | MongoDB + Mongoose |
| Backend | Node.js, Express.js, JWT, bcryptjs |
| Frontend | React 18, React Router 6, Vite |

## Features

- **CRUD** on donor records (name, blood group, location, contact, availability, last donated date)
- **Search** by blood group, city/area, and availability, with pagination
- **Authentication** with JWT (register, login, session restore)
- **Role-based access**
  - Guest: search donors (phone numbers hidden)
  - User: sees phone numbers; adds, edits, deletes their own donor records
  - Admin: manages every donor record; changes user roles; deletes users
- **Admin panel** with totals, user management, and all donor records
- **About page** listing the stack, roles, and REST endpoints

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

## Setup

```bash
# 1. Install everything (root, server, client)
npm run install-all

# 2. Configure the server
#    server/.env is already included. Edit MONGO_URI and JWT_SECRET if needed.
#    (server/.env.example shows the variables.)

# 3. Load sample data (optional but recommended; clears users and donors first)
npm run seed

# 4. Start API (port 5000) and React app (port 5173) together
npm run dev
```

Open http://localhost:5173

### Demo accounts (created by `npm run seed`)

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin@123 |
| User | user@example.com | User@123 |

New sign-ups are always regular users. An admin can promote them from the Admin panel.

### Run the parts separately

```bash
cd server && npm run dev     # API on http://localhost:5000
cd client && npm run dev     # UI on http://localhost:5173 (proxies /api to the API)
```

## Project structure

```
blood-donor-finder/
├── server/
│   ├── server.js              Express app entry
│   ├── config/db.js           MongoDB connection
│   ├── models/                User.js, Donor.js
│   ├── middleware/            auth.js (JWT + roles), error.js
│   ├── routes/                auth.js, donors.js, admin.js
│   └── scripts/seed.js        Sample data
└── client/
    └── src/
        ├── api.js             fetch wrapper (adds the JWT)
        ├── context/           AuthContext.jsx
        ├── components/        Navbar, DonorCard, BloodDrop, ProtectedRoute
        ├── pages/             Home, Donors, DonorForm, Dashboard, AdminPanel, Login, Register, About
        └── styles.css
```

## REST API

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | /api/auth/register | Create an account | Public |
| POST | /api/auth/login | Log in, returns JWT | Public |
| GET | /api/auth/me | Current user | Logged in |
| GET | /api/donors?bloodGroup=O-&location=&available=true&page=1 | Search donors | Public (contact hidden for guests) |
| GET | /api/donors/stats | Counts per blood group | Public |
| GET | /api/donors/mine | Donors you added | Logged in |
| GET | /api/donors/:id | One donor | Logged in |
| POST | /api/donors | Add donor | Logged in |
| PUT | /api/donors/:id | Update donor | Owner or admin |
| DELETE | /api/donors/:id | Delete donor | Owner or admin |
| GET | /api/admin/summary | Totals | Admin |
| GET | /api/admin/users | List users | Admin |
| GET | /api/admin/donors | All donor records | Admin |
| PATCH | /api/admin/users/:id/role | Change role | Admin |
| DELETE | /api/admin/users/:id | Delete user and their donors | Admin |

## Production build

```bash
cd client && npm run build      # outputs client/dist
cd server && npm start
```
Set `VITE_API_URL` (client) to your API URL, and `CLIENT_URL` (server) to your site URL.
