# BlogSphere Deployment Guide

This guide covers the deployment setup discussed for BlogSphere:

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Hosting: Vercel

## 1. Project structure

The repository is organized into separate frontend and backend folders:

```text
blogsphere/
├── client/   # React + Vite frontend
└── server/   # Express API
```

Create two Vercel projects from the same Git repository:

| Vercel project | Root directory |
|---|---|
| BlogSphere frontend | `client` |
| BlogSphere backend | `server` |

Keep the frontend and backend deployments separate.

## 2. Prepare MongoDB Atlas

1. Open MongoDB Atlas and select your cluster.
2. Confirm that the database user exists under **Database Access**.
3. Under **Network Access**, allow connections from your deployment environment. For a production setup, use the narrowest network access option your hosting arrangement supports; avoid leaving broad access enabled unnecessarily.
4. Copy the application connection string.
5. Replace the username/password placeholders with the database user's credentials.
6. Add the database name to the URI if you want to use a specific database.

Example format (not a real credential):

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database-name>
```

Do not commit this URI or share it publicly. If a real database password has been exposed, rotate it in Atlas and update every environment where it is used.

## 3. Configure the backend on Vercel

Create a Vercel project for the backend and set its **Root Directory** to `server`.

Add the following environment variables in the backend Vercel project's settings:

| Variable | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long, random, private secret |
| `JWT_EXPIRE` | For example, `7d` |
| `CLIENT_URL` | `https://blogsphere-three-xi.vercel.app` |
| `NODE_ENV` | `production` |

Add `PORT` only if your application specifically needs it for local development; Vercel provides the runtime port for deployed functions.

After changing environment variables, redeploy the backend so the deployment uses the updated values.

### Backend CORS

The backend must allow the deployed frontend's exact origin. For the setup discussed, a single CORS middleware before the API routes can be configured like this:

```js
const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
```

Important:

- Set the production `CLIENT_URL` to `https://blogsphere-three-xi.vercel.app`.
- Do not add a trailing slash to the origin.
- Keep only one CORS middleware.
- Register CORS before your API routes and error handlers.
- If you use a different frontend domain, update `CLIENT_URL` to that exact origin and redeploy.

## 4. Configure the frontend on Vercel

Create a second Vercel project and set its **Root Directory** to `client`.

Add this environment variable to the frontend Vercel project:

```env
VITE_API_URL=https://blogsphere-g5uh.vercel.app
```

The Axios instance can use it as the API host:

```js
import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
```

Vite variables are embedded into the frontend build. Never put database credentials, JWT signing secrets, or other private values in variables prefixed with `VITE_`.

After changing `VITE_API_URL`, redeploy the frontend.

## 5. Local development environment

Create `server/.env` for local backend development:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Do not commit either `.env` file. Add environment files to `.gitignore` and commit example templates instead:

```gitignore
.env
.env.*
!.env.example
node_modules
```

The `.env.example` files should contain placeholder values only, never real credentials.

## 6. Backend startup and serverless deployment

For local development, the Express app can start listening on the configured port. For Vercel, export the Express app as the default export and avoid starting a separate persistent listener in production.

A common pattern is:

```js
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Database connection failed:", error);
            process.exit(1);
        });
}

export default app;
```

Make sure your database connection helper reuses an existing Mongoose connection where possible and propagates connection errors. Do not call `process.exit()` from a request handler in a serverless deployment.

Your deployed project must also have a Vercel-compatible configuration and entry point for the Express app. Verify the actual Vercel build output rather than assuming that a successful local `npm run dev` guarantees deployment compatibility.

## 7. Verify the deployment

Open these deployed URLs:

- Frontend: https://blogsphere-three-xi.vercel.app
- Backend root: https://blogsphere-g5uh.vercel.app
- Backend health check: https://blogsphere-g5uh.vercel.app/api/v1/health

The health endpoint should return a successful response and report whether the database connection is connected.

Example health response shape:

```json
{
  "success": true,
  "uptime": 123,
  "timestamp": "2026-01-01T00:00:00.000Z",
  "database": "connected"
}
```

The values above are illustrative, not a live response.

## 8. Troubleshooting

### CORS error in the browser

- Check the browser console for the exact frontend origin.
- Set the backend's `CLIENT_URL` to that exact origin.
- Remove trailing slashes from the origin.
- Ensure CORS middleware is registered before routes.
- Remove duplicate or late CORS middleware.
- Redeploy the backend after changing its environment variables.

### MongoDB authentication failed

- Check the Atlas database username and password.
- Confirm that the URI uses the database user's credentials, not your Atlas account login.
- URL-encode special characters in the password when required by the connection URI.
- Confirm that the deployment's `MONGO_URI` is current.
- Rotate credentials if they were exposed.

### Frontend still calls localhost

- Check that the production `VITE_API_URL` is set on the frontend Vercel project.
- Confirm the Axios instance uses `import.meta.env.VITE_API_URL`.
- Redeploy the frontend; Vite environment variables are applied at build time.

### Backend returns 404

- Check the deployed route prefix. BlogSphere API routes use `/api/v1`.
- Confirm the requested path and HTTP method match the route declaration.
- Check Vercel function logs for build or runtime errors.

### Database reports disconnected

- Check `MONGO_URI` in the backend deployment.
- Check Atlas Network Access.
- Review Vercel function logs and the Mongoose connection error.
- Confirm the app awaits the database connection before handling database-dependent requests.

## 9. Deployment checklist

- [ ] MongoDB Atlas database user and network access are configured.
- [ ] Backend Vercel root directory is `server`.
- [ ] Frontend Vercel root directory is `client`.
- [ ] Backend environment variables are configured.
- [ ] Frontend `VITE_API_URL` points to the deployed backend.
- [ ] Backend `CLIENT_URL` matches the deployed frontend origin exactly.
- [ ] CORS middleware is registered once, before routes.
- [ ] `.env` files and secrets are not committed to Git.
- [ ] Backend health endpoint responds successfully.
- [ ] Health endpoint reports the expected database status.
- [ ] Frontend can load API data and authenticated requests work.
- [ ] Both projects have been redeployed after environment changes.

---

**Deployment URLs**

- Frontend: https://blogsphere-three-xi.vercel.app
- Backend: https://blogsphere-g5uh.vercel.app
- Health check: https://blogsphere-g5uh.vercel.app/api/v1/health

This guide reflects the deployment configuration discussed for this project. Confirm the actual Vercel build settings, route handlers, and environment variables in your own project before treating deployment as complete.
