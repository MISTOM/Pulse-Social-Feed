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


  app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Handle preflight OPTIONS requests
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


  server.applyMiddleware({
    app,
    cors: {
      origin: '*',
      credentials: true,
    }
  });

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