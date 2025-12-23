# Indian Movie Discovery Engine (YAMD)

## Vision
A comprehensive Indian movie discovery platform enabling complex queries like "movies featuring Actor A and Actor B" or "films with Music Director X and Actor Y". Free, crowdsourced, with AI agent integration via MCP.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
├─────────────────────┬─────────────────────┬────────────────────┤
│   Web App (Vite)    │  Mobile (Expo)      │   AI Agents (MCP)  │
│   React + shadcn/ui │  React Native       │   Claude, GPT, etc │
└─────────────────────┴─────────────────────┴────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API SERVER (Express + tRPC)                   │
├─────────────────────────────────────────────────────────────────┤
│  • Movie Search API (complex queries)                            │
│  • User Management API                                           │
│  • Watchlist API                                                 │
│  • Crowdsource Contributions API                                 │
│  • Payment API (Stripe)                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    MCP SERVER (stdio)                            │
├─────────────────────────────────────────────────────────────────┤
│  • search_movies, save_to_watchlist, get_recommendations         │
│  • movie://, actor://, watchlist:// resources                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│  SQLite (local) / PostgreSQL (production) + Prisma ORM          │
│  • Movies, Actors, Directors, Music Directors                    │
│  • Users, Watchlists, Reviews                                    │
│  • Contributions, Payments                                       │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure (Monorepo)

```
yamd/
├── packages/
│   ├── web/                    # React + Vite + shadcn/ui
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── pages/          # Route pages
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── lib/            # Utilities
│   │   │   └── store/          # Zustand stores
│   │   └── package.json
│   │
│   ├── api/                    # Express + tRPC backend
│   │   ├── src/
│   │   │   ├── routers/        # tRPC routers
│   │   │   ├── services/       # Business logic
│   │   │   └── middleware/     # Auth, etc
│   │   └── package.json
│   │
│   ├── mobile/                 # Expo React Native
│   │   ├── app/                # Expo Router pages
│   │   ├── components/         # RN components
│   │   └── package.json
│   │
│   └── shared/                 # Shared types & utilities
│       ├── src/
│       │   ├── types/          # TypeScript types
│       │   └── validators/     # Zod schemas
│       └── package.json
│
├── prisma/                     # Database schema
│   ├── schema.prisma
│   └── seed.ts
│
├── mcp/                        # MCP Server
│   ├── server.ts
│   └── tools/
│
└── package.json                # Root package.json (workspaces)
```

## Tech Stack

### Web (packages/web)
- **Build**: Vite 5
- **Framework**: React 18
- **UI**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS
- **State**: Zustand + TanStack Query
- **API Client**: tRPC React Query
- **Forms**: React Hook Form + Zod

### API (packages/api)
- **Runtime**: Node.js + Express
- **Type-safe API**: tRPC
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Payments**: Stripe

### Mobile (packages/mobile)
- **Framework**: Expo SDK 50
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind for RN)
- **State**: Zustand
- **API**: Shared tRPC client

### MCP Server
- **SDK**: @modelcontextprotocol/sdk
- **Transport**: stdio
- **Tools**: search, watchlist, recommendations

## Database Schema

### Core Entities

```prisma
model Movie {
  id            String   @id @default(cuid())
  title         String
  titleHindi    String?
  titleRegional String?
  year          Int
  runtime       Int?
  language      String   // Hindi, Tamil, Telugu, etc.
  industry      String   // Bollywood, Tollywood, Kollywood, etc.
  plot          String?
  posterUrl     String?
  trailerUrl    String?
  avgRating     Float    @default(0)
  voteCount     Int      @default(0)

  cast          MoviePerson[]
  watchlistItems WatchlistItem[]
  contributions Contribution[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Person {
  id        String   @id @default(cuid())
  name      String
  nameHindi String?
  photoUrl  String?
  birthDate DateTime?
  bio       String?

  movies    MoviePerson[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model MoviePerson {
  id           String @id @default(cuid())
  movieId      String
  personId     String
  role         String // lead_actor, supporting_actor, director, music_director, etc.
  characterName String?

  movie  Movie  @relation(fields: [movieId], references: [id])
  person Person @relation(fields: [personId], references: [id])

  @@unique([movieId, personId, role])
}

model User {
  id                String   @id @default(cuid())
  email             String   @unique
  passwordHash      String?
  name              String
  avatarUrl         String?
  isPatron          Boolean  @default(false)
  patronTier        String?  // supporter, champion, legend
  contributionCount Int      @default(0)

  watchlist     WatchlistItem[]
  contributions Contribution[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model WatchlistItem {
  id       String @id @default(cuid())
  userId   String
  movieId  String
  status   String // want_to_watch, watched, liked, recommended
  rating   Int?
  notes    String?

  user  User  @relation(fields: [userId], references: [id])
  movie Movie @relation(fields: [movieId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, movieId])
}

model Contribution {
  id          String @id @default(cuid())
  userId      String
  movieId     String?
  entityType  String  // movie, person
  entityId    String
  fieldChanged String
  oldValue    String?
  newValue    String
  status      String  @default("pending") // pending, approved, rejected

  user  User   @relation(fields: [userId], references: [id])
  movie Movie? @relation(fields: [movieId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Complex Query API

### Query Interface
```typescript
interface MovieQuery {
  // People filters (AND within, OR between arrays)
  actors?: string[]           // All these actors must be in movie
  directors?: string[]        // Any of these directors
  musicDirectors?: string[]   // Any of these music directors

  // Time filters
  yearRange?: [number, number]
  decade?: string             // "90s", "2000s", etc.

  // Classification
  industries?: string[]       // Bollywood, Tollywood, etc.
  languages?: string[]        // Hindi, Tamil, Telugu, etc.

  // Rating
  ratingMin?: number

  // Sorting & Pagination
  sortBy?: 'year' | 'rating' | 'title' | 'recent'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
```

### Example Queries
```typescript
// Movies with Shah Rukh Khan AND Kajol
{ actors: ["Shah Rukh Khan", "Kajol"] }

// Rajkumar Hirani films with Aamir Khan
{ directors: ["Rajkumar Hirani"], actors: ["Aamir Khan"] }

// A.R. Rahman films from 90s
{ musicDirectors: ["A.R. Rahman"], decade: "90s" }

// Telugu movies with Mahesh Babu, rated 7+
{ actors: ["Mahesh Babu"], industries: ["Tollywood"], ratingMin: 7 }
```

## MCP Tools

```typescript
// Search movies with complex criteria
search_movies({
  query: MovieQuery
}) => Movie[]

// Add movie to watchlist
save_to_watchlist({
  movieId: string,
  status: 'want_to_watch' | 'watched' | 'liked' | 'recommended',
  notes?: string
}) => WatchlistItem

// Get user's watchlist
get_watchlist({
  status?: string,
  limit?: number
}) => WatchlistItem[]

// Get AI recommendations
get_recommendations({
  basedOn: 'watchlist' | 'liked',
  limit?: number
}) => Movie[]
```

## Payment Tiers (Patreon-style)

### Free
- Unlimited search
- Basic watchlist (100 movies)
- Contribute to database

### Supporter ($3/mo)
- Unlimited watchlist
- No ads
- Supporter badge
- Priority support

### Champion ($10/mo)
- All Supporter benefits
- API access
- Early features
- Export data

### Legend ($25/mo)
- All Champion benefits
- MCP server access
- Custom lists
- Credits in app

## Development Phases

### Phase 1: Foundation (Current)
- [x] Project architecture
- [ ] Monorepo setup
- [ ] Database schema
- [ ] Basic API
- [ ] Web UI skeleton

### Phase 2: Core Features
- [ ] Complex search
- [ ] Movie details
- [ ] User auth
- [ ] Watchlist

### Phase 3: Mobile & MCP
- [ ] Expo app
- [ ] MCP server
- [ ] Shared components

### Phase 4: Crowdsourcing
- [ ] Contribution system
- [ ] Moderation
- [ ] Gamification

### Phase 5: Monetization
- [ ] Stripe integration
- [ ] Patron tiers
- [ ] Premium features
