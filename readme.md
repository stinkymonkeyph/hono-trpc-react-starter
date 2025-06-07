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

## 🔧 Configuration

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
