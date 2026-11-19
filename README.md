# BlogSphere

A full-stack blogging platform where users can explore articles, publish content, interact with posts, and manage their blogging experience.

## Links

- **Live site:** https://blogsphere-three-xi.vercel.app/
- **API health check:** <your-render-url>/api/v1/health
- **Demo video:** <your video link>
- **Postman collection:** docs/BlogSphere_Postman.json

## 🌐 Live Demo

- **Frontend:** https://blogsphere-three-xi.vercel.app
- **Backend API:** https://blogsphere-g5uh.vercel.app
- **API Health Check:** https://blogsphere-g5uh.vercel.app/api/v1/health

## ✨ Features

- User authentication and authorization
- Create, read, update, and delete blog posts
- Browse blogs by categories and tags
- Like and bookmark articles
- Comment on blog posts
- Search and sort articles
- Admin management
- Responsive user interface
- REST API integration

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- React Router DOM
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

**Deployment**
- Vercel
- MongoDB Atlas

## 📁 Project Structure

```text
BlogSphere/
│
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env
│
├── server/                 # Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🚀 Getting Started

Follow these instructions to run BlogSphere locally.

### 1. Clone the repository

```bash
git clone https://github.com/shadaf266/blogsphere.git
cd BlogSphere
```

### 2. Setup the Backend

Open a terminal:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### 3. Setup the Frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## ⚙️ Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT authentication |
| `JWT_EXPIRE` | JWT expiration duration |
| `CLIENT_URL` | Frontend origin allowed by CORS |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API server URL |

**Important:** Never commit `.env` files or expose database credentials and JWT secrets in your repository.

## 🔗 API Endpoints

Base URL:

```text
https://blogsphere-g5uh.vercel.app/api/v1
```

| Route | Purpose |
|---|---|
| `/health` | API health check |
| `/auth` | Authentication |
| `/blogs` | Blog management |
| `/categories` | Category management |
| `/comments` | Comment management |
| `/bookmarks` | Bookmark management |
| `/tags` | Tag management |
| `/admin` | Admin operations |
| `/inquiries` | Inquiry management |

## 🏗️ Build for Production

Frontend:

```bash
cd client
npm run build
```

The production build will be generated inside the `dist` directory.

## 👨‍💻 Author

Developed as a full-stack web development project using React, Node.js, Express, and MongoDB.

---

⭐ If you find this project interesting, consider giving it a star!