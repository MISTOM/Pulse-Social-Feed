import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './utils/prisma';
import { typeDefs } from './graphql/schema';
import { resolvers } from './resolvers';
import { authenticateUser } from './middleware/auth';

// Load environment variables
dotenv.config();

async function startServer() {
  // Create Express application
  const app = express();


  // Define allowed origins
  const allowedOrigins = ['https://pulse-social-feed-fe.vercel.app', 'http://localhost:5173'];

  // If FRONTEND_URL is set in environment, add it to allowed origins
  if (process.env.FRONTEND_URL) {
    if (!allowedOrigins.includes(process.env.FRONTEND_URL)) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }
  }

  // Apply CORS middleware with proper configuration
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Handle preflight OPTIONS requests explicitly
  app.options('*', cors());

  app.use(express.json());
  app.use(authenticateUser);

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {
        prisma,
        user: req.user,
      };
    },
  });

  await server.start();


  //@ts-ignore
  server.applyMiddleware({ app, cors: false });

  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Start the server
startServer()
  .catch((error) => {
    console.error('Failed to start server:', error);
  });