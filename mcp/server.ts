#!/usr/bin/env node
/**
 * YAMD MCP Server
 *
 * Provides AI agents with tools to search Indian movies and manage watchlists.
 * Uses stdio transport for communication.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { PrismaClient } from '@prisma/client'
import { decadeToYearRange, type Decade } from '@yamd/shared'

const prisma = new PrismaClient()

// Create server
const server = new Server(
  {
    name: 'yamd-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
)

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_movies',
        description: `Search for Indian movies with complex criteria. Supports filtering by multiple actors (AND condition), directors, music directors, year range, decade, industry (Bollywood, Tollywood, etc.), language, and rating.

Examples:
- "Movies with Shah Rukh Khan and Kajol": { actors: ["Shah Rukh Khan", "Kajol"] }
- "Rajkumar Hirani films with Aamir Khan": { directors: ["Rajkumar Hirani"], actors: ["Aamir Khan"] }
- "90s A.R. Rahman movies": { musicDirectors: ["A.R. Rahman"], decade: "90s" }
- "Telugu movies rated above 7": { industries: ["Tollywood"], ratingMin: 7 }`,
        inputSchema: {
          type: 'object',
          properties: {
            search: {
              type: 'string',
              description: 'Text search in title or plot',
            },
            actors: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of actors (AND condition - movie must have all)',
            },
            directors: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of directors',
            },
            musicDirectors: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of music directors',
            },
            yearRange: {
              type: 'array',
              items: { type: 'number' },
              minItems: 2,
              maxItems: 2,
              description: 'Year range [start, end]',
            },
            decade: {
              type: 'string',
              enum: ['50s', '60s', '70s', '80s', '90s', '2000s', '2010s', '2020s'],
              description: 'Decade filter',
            },
            industries: {
              type: 'array',
              items: { type: 'string' },
              description: 'Industries: Bollywood, Tollywood, Kollywood, etc.',
            },
            languages: {
              type: 'array',
              items: { type: 'string' },
              description: 'Languages: Hindi, Tamil, Telugu, etc.',
            },
            ratingMin: {
              type: 'number',
              description: 'Minimum rating (0-10)',
            },
            limit: {
              type: 'number',
              description: 'Max results (default 10)',
            },
          },
        },
      },
      {
        name: 'get_movie',
        description: 'Get detailed information about a specific movie by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Movie ID',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_person_filmography',
        description: 'Get filmography of an actor, director, or music director',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Person name',
            },
            role: {
              type: 'string',
              enum: ['lead_actor', 'supporting_actor', 'director', 'music_director'],
              description: 'Filter by role',
            },
            limit: {
              type: 'number',
              description: 'Max results (default 20)',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'save_to_watchlist',
        description: 'Save a movie to the user watchlist (requires user context)',
        inputSchema: {
          type: 'object',
          properties: {
            movieId: {
              type: 'string',
              description: 'Movie ID to save',
            },
            status: {
              type: 'string',
              enum: ['want_to_watch', 'watched', 'liked', 'recommended'],
              description: 'Watchlist status',
            },
            notes: {
              type: 'string',
              description: 'Optional notes',
            },
          },
          required: ['movieId', 'status'],
        },
      },
      {
        name: 'get_recommendations',
        description: 'Get movie recommendations based on preferences',
        inputSchema: {
          type: 'object',
          properties: {
            basedOn: {
              type: 'string',
              enum: ['popular', 'industry', 'actor', 'director'],
              description: 'Recommendation basis',
            },
            industry: {
              type: 'string',
              description: 'Industry for filtering (if basedOn is industry)',
            },
            personName: {
              type: 'string',
              description: 'Person name (if basedOn is actor/director)',
            },
            limit: {
              type: 'number',
              description: 'Max results (default 10)',
            },
          },
          required: ['basedOn'],
        },
      },
    ],
  }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'search_movies': {
        const {
          search,
          actors,
          directors,
          musicDirectors,
          yearRange,
          decade,
          industries,
          languages,
          ratingMin,
          limit = 10,
        } = args as any

        // Build where clause
        const where: any = {}
        const conditions: any[] = []

        if (search) {
          conditions.push({
            OR: [
              { title: { contains: search } },
              { titleHindi: { contains: search } },
              { plot: { contains: search } },
            ],
          })
        }

        if (yearRange) {
          where.year = { gte: yearRange[0], lte: yearRange[1] }
        } else if (decade) {
          const [start, end] = decadeToYearRange(decade as Decade)
          where.year = { gte: start, lte: end }
        }

        if (industries?.length) {
          where.industry = { in: industries }
        }

        if (languages?.length) {
          where.language = { in: languages }
        }

        if (ratingMin !== undefined) {
          where.avgRating = { gte: ratingMin }
        }

        if (actors?.length) {
          for (const actor of actors) {
            conditions.push({
              cast: {
                some: {
                  role: { in: ['lead_actor', 'supporting_actor'] },
                  person: { name: { contains: actor } },
                },
              },
            })
          }
        }

        if (directors?.length) {
          conditions.push({
            cast: {
              some: {
                role: 'director',
                person: { name: { in: directors } },
              },
            },
          })
        }

        if (musicDirectors?.length) {
          conditions.push({
            cast: {
              some: {
                role: 'music_director',
                person: { name: { in: musicDirectors } },
              },
            },
          })
        }

        if (conditions.length) {
          where.AND = conditions
        }

        const movies = await prisma.movie.findMany({
          where,
          take: limit,
          orderBy: { avgRating: 'desc' },
          include: {
            cast: {
              include: { person: true },
              take: 5,
            },
          },
        })

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                movies.map((m) => ({
                  id: m.id,
                  title: m.title,
                  year: m.year,
                  industry: m.industry,
                  language: m.language,
                  rating: m.avgRating,
                  cast: m.cast.map((c) => ({
                    name: c.person.name,
                    role: c.role,
                  })),
                })),
                null,
                2
              ),
            },
          ],
        }
      }

      case 'get_movie': {
        const { id } = args as { id: string }
        const movie = await prisma.movie.findUnique({
          where: { id },
          include: {
            cast: {
              include: { person: true },
            },
          },
        })

        if (!movie) {
          return {
            content: [{ type: 'text', text: 'Movie not found' }],
            isError: true,
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  id: movie.id,
                  title: movie.title,
                  titleHindi: movie.titleHindi,
                  year: movie.year,
                  runtime: movie.runtime,
                  industry: movie.industry,
                  language: movie.language,
                  plot: movie.plot,
                  rating: movie.avgRating,
                  votes: movie.voteCount,
                  posterUrl: movie.posterUrl,
                  trailerUrl: movie.trailerUrl,
                  cast: movie.cast.map((c) => ({
                    name: c.person.name,
                    role: c.role,
                    character: c.characterName,
                  })),
                },
                null,
                2
              ),
            },
          ],
        }
      }

      case 'get_person_filmography': {
        const { name: personName, role, limit = 20 } = args as any

        const person = await prisma.person.findFirst({
          where: { name: { contains: personName } },
          include: {
            movies: {
              where: role ? { role } : undefined,
              include: { movie: true },
              orderBy: { movie: { year: 'desc' } },
              take: limit,
            },
          },
        })

        if (!person) {
          return {
            content: [{ type: 'text', text: 'Person not found' }],
            isError: true,
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  id: person.id,
                  name: person.name,
                  bio: person.bio,
                  filmography: person.movies.map((m) => ({
                    movieId: m.movie.id,
                    title: m.movie.title,
                    year: m.movie.year,
                    role: m.role,
                    character: m.characterName,
                    rating: m.movie.avgRating,
                  })),
                },
                null,
                2
              ),
            },
          ],
        }
      }

      case 'save_to_watchlist': {
        // Note: In production, this would need user authentication context
        return {
          content: [
            {
              type: 'text',
              text: 'Watchlist operations require user authentication. Please use the web or mobile app.',
            },
          ],
        }
      }

      case 'get_recommendations': {
        const { basedOn, industry, personName, limit = 10 } = args as any

        let movies: any[]

        switch (basedOn) {
          case 'popular':
            movies = await prisma.movie.findMany({
              orderBy: [{ avgRating: 'desc' }, { voteCount: 'desc' }],
              take: limit,
              include: {
                cast: {
                  where: { role: { in: ['lead_actor', 'director'] } },
                  include: { person: true },
                  take: 3,
                },
              },
            })
            break

          case 'industry':
            if (!industry) {
              return {
                content: [
                  { type: 'text', text: 'Industry parameter required for industry-based recommendations' },
                ],
                isError: true,
              }
            }
            movies = await prisma.movie.findMany({
              where: { industry },
              orderBy: { avgRating: 'desc' },
              take: limit,
              include: {
                cast: {
                  where: { role: { in: ['lead_actor', 'director'] } },
                  include: { person: true },
                  take: 3,
                },
              },
            })
            break

          case 'actor':
          case 'director':
            if (!personName) {
              return {
                content: [
                  { type: 'text', text: 'personName parameter required' },
                ],
                isError: true,
              }
            }
            const roleFilter = basedOn === 'actor' ? ['lead_actor', 'supporting_actor'] : ['director']
            movies = await prisma.movie.findMany({
              where: {
                cast: {
                  some: {
                    role: { in: roleFilter },
                    person: { name: { contains: personName } },
                  },
                },
              },
              orderBy: { avgRating: 'desc' },
              take: limit,
              include: {
                cast: {
                  where: { role: { in: ['lead_actor', 'director'] } },
                  include: { person: true },
                  take: 3,
                },
              },
            })
            break

          default:
            return {
              content: [{ type: 'text', text: 'Invalid basedOn value' }],
              isError: true,
            }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                movies.map((m) => ({
                  id: m.id,
                  title: m.title,
                  year: m.year,
                  industry: m.industry,
                  rating: m.avgRating,
                  cast: m.cast.map((c: any) => ({
                    name: c.person.name,
                    role: c.role,
                  })),
                })),
                null,
                2
              ),
            },
          ],
        }
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        }
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    }
  }
})

// Define resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'yamd://industries',
        name: 'Indian Film Industries',
        description: 'List of all Indian film industries (Bollywood, Tollywood, etc.)',
        mimeType: 'application/json',
      },
      {
        uri: 'yamd://languages',
        name: 'Indian Languages',
        description: 'List of supported Indian languages',
        mimeType: 'application/json',
      },
      {
        uri: 'yamd://stats',
        name: 'Database Statistics',
        description: 'Statistics about movies and people in the database',
        mimeType: 'application/json',
      },
    ],
  }
})

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params

  switch (uri) {
    case 'yamd://industries':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              industries: [
                { name: 'Bollywood', language: 'Hindi', location: 'Mumbai' },
                { name: 'Tollywood', language: 'Telugu', location: 'Hyderabad' },
                { name: 'Kollywood', language: 'Tamil', location: 'Chennai' },
                { name: 'Sandalwood', language: 'Kannada', location: 'Bangalore' },
                { name: 'Mollywood', language: 'Malayalam', location: 'Kochi' },
                { name: 'Pollywood', language: 'Punjabi', location: 'Punjab' },
                { name: 'Bengali', language: 'Bengali', location: 'Kolkata' },
                { name: 'Marathi', language: 'Marathi', location: 'Mumbai' },
              ],
            }),
          },
        ],
      }

    case 'yamd://languages':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              languages: [
                'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam',
                'Bengali', 'Marathi', 'Punjabi', 'Gujarati', 'Odia',
                'Bhojpuri', 'English',
              ],
            }),
          },
        ],
      }

    case 'yamd://stats':
      const [movieCount, personCount, userCount] = await Promise.all([
        prisma.movie.count(),
        prisma.person.count(),
        prisma.user.count(),
      ])
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              movies: movieCount,
              people: personCount,
              users: userCount,
            }),
          },
        ],
      }

    default:
      throw new Error(`Unknown resource: ${uri}`)
  }
})

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('YAMD MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
