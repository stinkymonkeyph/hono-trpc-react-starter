# Hono + React + tRPC Monorepo Starter

A full-stack TypeScript monorepo with Hono backend, React frontend, tRPC for type-safe APIs, Prisma for database management, and Tailwind CSS for styling.

## 🏗️ Project Structure

```
hono-react-trpc-starter/
├── package.json                 # Root package.json with workspaces
├── packages/
│   ├── backend/                 # Hono + tRPC + Prisma backend
│   │   ├── prisma/
│   │   │   └── schema.prisma    # Database schema
│   │   ├── scripts/
│   │   │   └── ensure-db.js     # Database setup script
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── prisma.ts    # Prisma client
│   │   │   │   └── trpc.ts      # tRPC setup
│   │   │   ├── routers/
│   │   │   │   ├── user.ts      # User routes
│   │   │   │   ├── post.ts      # Post routes
│   │   │   │   └── index.ts     # Router composition
│   │   │   └── index.ts         # Main server file
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                     # React + Tailwind frontend
│       ├── src/
│       │   ├── lib/
│       │   │   └── trpc.ts      # tRPC client
│       │   ├── App.tsx          # Main React component
│       │   ├── main.tsx         # React entry point
│       │   └── index.css        # Tailwind styles
│       ├── package.json
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       └── vite.config.ts
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** 8+

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hono-react-trpc-starter
   ```

2. **Install all dependencies** (installs for both backend and frontend)
   ```bash
   npm install
   ```

3. **Set up the database** (one-time setup)
   ```bash
   cd packages/backend
   npm run db:setup
   cd ../..
   ```

### Development

**Start both backend and frontend** (recommended):
```bash
npm run dev
```

This runs:
- Backend on `http://localhost:3001`
- Frontend on `http://localhost:5173`

**Or run them separately:**

```bash
# Terminal 1 - Backend only
npm run dev:backend

# Terminal 2 - Frontend only  
npm run dev:web
```

### Building for Production

```bash
# Build both packages
npm run build

# Or build individually
npm run build:backend
npm run build:web
```

## 📦 Available Scripts

### Root Level Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend |
| `npm run dev:backend` | Start only backend server |
| `npm run dev:web` | Start only frontend dev server |
| `npm run build` | Build both packages |
| `npm run build:backend` | Build only backend |
| `npm run build:web` | Build only frontend |

### Backend Commands

```bash
cd packages/backend

# Development
npm run dev                 # Start dev server with auto DB setup
npm run build              # Build TypeScript

# Database Management
npm run db:generate        # Generate Prisma client
npm run db:push           # Push schema to database
npm run db:setup          # Generate + push (first-time setup)
npm run db:ensure         # Check and setup DB if needed
```

### Frontend Commands

```bash
cd packages/web

# Development
npm run dev               # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

## 🗄️ Database Setup

This project uses **SQLite** with **Prisma ORM** for easy local development.

### First Time Setup

1. **Generate Prisma client and create database:**
   ```bash
   cd packages/backend
   npm run db:setup
   ```

2. **The database file will be created at:**
   ```
   packages/backend/prisma/dev.db
   ```

### Database Schema

The project includes two models:
- **User** - with email, name, and timestamps
- **Post** - with title, content, published status, and author relationship

### Modifying the Schema

1. **Edit the schema:**
   ```bash
   # Edit packages/backend/prisma/schema.prisma
   ```

2. **Apply changes:**
   ```bash
   cd packages/backend
   npm run db:push
   ```

### Viewing Data

Use Prisma Studio to view/edit your data:
```bash
cd packages/backend
npx prisma studio
```

## 🐳 Docker Deployment

This project includes Docker configurations for easy deployment.

### Prerequisites for Docker

- **Docker** 20.10+
- **Docker Compose** 2.0+ (or `docker-compose`)

### Quick Docker Deployment

**Deploy with one command:**
```bash
./scripts/deploy.sh
```

This will:
- Build both backend and frontend Docker images
- Start all services with proper networking
- Set up the database automatically
- Run health checks

**Access your application:**
- Frontend: `http://localhost` (port 80)
- Backend: `http://localhost:3001`
- Health check: `http://localhost:3001/health`

### Manual Docker Commands

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild specific service
docker compose build backend --no-cache
docker compose build frontend --no-cache
```

### Docker Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| **Backend** | `hono-backend` | 3001 | Node.js API server |
| **Frontend** | `react-frontend` | 80 | Nginx static files |

### Production Deployment

The Docker setup is production-ready with:

- ✅ **Multi-stage builds** - Optimized image sizes
- ✅ **Non-root users** - Security best practices  
- ✅ **Health checks** - Automatic service monitoring
- ✅ **SSL support** - OpenSSL libraries for Prisma
- ✅ **Nginx optimization** - Gzip, caching, security headers
- ✅ **Database persistence** - Data survives container restarts

### Deployment Scripts

```bash
# Deploy production environment
./scripts/deploy.sh

# Deploy development environment (with hot reload)
./scripts/deploy-dev.sh
```

### Environment Variables for Docker

Create `.env` files for environment-specific configuration:

**Backend environment (`packages/backend/.env`):**
```env
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=production
```

### Scaling and Production Considerations

**For production deployment:**

1. **Use a production database:**
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

2. **Set up reverse proxy:**
   - Use nginx or Traefik for SSL termination
   - Configure domain routing

3. **Add monitoring:**
   - Health check endpoints are included
   - Add logging aggregation (ELK stack, etc.)

4. **Security:**
   - Change default ports
   - Add firewall rules
   - Use secrets management

### Docker Compose Profiles

```bash
# Development with hot reload
docker compose -f docker-compose.dev.yml up -d

# Production optimized
docker compose up -d

# With additional services (database, redis, etc.)
docker compose --profile full up -d
```

### Environment Variables

Create a `.env` file in `packages/backend/`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3001
NODE_ENV=development
```

### Changing Database Provider

To use PostgreSQL or MySQL instead of SQLite:

1. **Update `packages/backend/prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"  // or "mysql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Update your `.env`:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   ```

3. **Install database driver:**
   ```bash
   cd packages/backend
   npm install pg @types/pg  # for PostgreSQL
   # or
   npm install mysql2        # for MySQL
   ```

## 🌐 API Endpoints

### Backend Server (`http://localhost:3001`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/trpc/*` | POST | tRPC API endpoints |

### Frontend (`http://localhost:5173`)

- User management interface
- Create and view users
- Real-time updates via tRPC

## 🛠️ Tech Stack

### Backend
- **[Hono](https://hono.dev/)** - Fast web framework for the edge
- **[tRPC](https://trpc.io/)** - End-to-end typesafe APIs
- **[Prisma](https://prisma.io/)** - Next-generation ORM
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[SQLite](https://sqlite.org/)** - Local database

### Frontend
- **[React](https://react.dev/)** - UI library
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and caching

### Development
- **[TypeScript](https://typescriptlang.org/)** - Type safety
- **[tsx](https://github.com/esbuild-kit/tsx)** - TypeScript execution
- **[npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)** - Monorepo management

## 🧪 Example Usage

### Creating a User

The frontend provides a form to create users. You can also use the tRPC API directly:

```typescript
// Frontend code example
const createUser = trpc.user.create.useMutation()

await createUser.mutateAsync({
  email: "john@example.com",
  name: "John Doe"
})
```

### Backend API Example

```bash
# Create a user via HTTP
curl -X POST http://localhost:3001/trpc/user.create \
  -H "Content-Type: application/json" \
  -d '{"email": "jane@example.com", "name": "Jane Smith"}'

# Get all users
curl http://localhost:3001/trpc/user.getAll
```

## 🔍 Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules packages/*/node_modules
   npm install
   ```

2. **Database connection issues**
   ```bash
   cd packages/backend
   npm run db:setup
   ```

3. **Port already in use**
   ```bash
   # Kill processes using the ports
   lsof -ti:3001 | xargs kill -9  # Backend
   lsof -ti:5173 | xargs kill -9  # Frontend
   ```

4. **tRPC type errors**
   ```bash
   # Ensure backend is built and types are exported
   cd packages/backend
   npm run build
   ```

### Development Tips

- **Hot reloading**: Both backend and frontend support hot reloading
- **Type safety**: Changes to backend routes automatically update frontend types
- **Database changes**: Use `npm run db:push` to apply schema changes quickly
- **Debugging**: Check browser network tab and backend console for API issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

---

**Happy coding!** 🚀

For issues or questions, please open a GitHub issue.
