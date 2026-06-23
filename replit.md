# CERES AI - Cadastro Estratégico para Regularização e Eficiência Sustentável com Inteligência Artificial

## Overview

CERES AI is a full-stack environmental monitoring platform designed for the Brazilian Cerrado biome. It makes the Rural Environmental Registry (CAR) more accessible and intelligent for rural producers, technicians, and public managers. The platform provides real-time sensor data tracking, fire hotspot monitoring, weather monitoring, fire alert management, geolocated fire reports (denúncias), gamification, and an AI chatbot assistant — all in Brazilian Portuguese. Features a React frontend with a nature-inspired UI theme and an Express backend with PostgreSQL database storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state caching and synchronization
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom nature-themed color palette (forest greens, earth tones)
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with TypeScript (tsx for development)
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Schema Validation**: Zod for request/response validation with drizzle-zod integration
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Build System**: Vite for frontend, esbuild for backend bundling

### Project Structure
```
client/           # React frontend application
  src/
    components/   # Reusable UI components
    hooks/        # Custom React hooks for data fetching
    pages/        # Route page components
    lib/          # Utilities and query client setup
server/           # Express backend
  routes.ts       # API route handlers
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Shared code between frontend and backend
  schema.ts       # Drizzle database schema definitions
  routes.ts       # API route definitions with Zod schemas
```

### API Design Pattern
The application uses a typed API contract defined in `shared/routes.ts`. This file exports route definitions with:
- HTTP method and path
- Input validation schemas (Zod)
- Response type schemas
- Helper function `buildUrl` for dynamic path parameters

This ensures type safety between frontend and backend without code generation.

### Database Schema
Core entities defined in `shared/schema.ts`:
- **users**: Authentication with email/password
- **sensors**: IoT sensor devices with location coordinates
- **readings**: Time-series sensor measurements
- **alerts**: System notifications with severity levels
- **weatherData**: Cached weather API responses

### Authentication
Simple session-based authentication with SHA256 password hashing. Sessions stored in PostgreSQL via connect-pg-simple.

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable or individual `PG*` variables

### External APIs
- **Open-Meteo API**: Free weather data API (no authentication required) - used for real-time weather forecasting in the Cerrado region

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@tanstack/react-query`: Server state management
- `recharts`: Chart visualizations
- `date-fns`: Date formatting utilities
- `wouter`: Client-side routing
- `zod`: Runtime type validation

### Development Tools
- `vite`: Frontend dev server and bundler
- `tsx`: TypeScript execution for Node.js
- `esbuild`: Production backend bundling