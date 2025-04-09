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

  // Apply middleware
 // Apply middleware with updated CORS configuration
 app.use(cors({
  origin: process.env.FRONTEND_URL || ['https://pulse-social-feed-fe.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
  app.use(express.json());
  app.use(authenticateUser);

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {
        prisma,
        user: req.user, // Added by auth middleware
      };
    },
  });

  await server.start();
  
  // Apply Apollo middleware to Express

  //@ts-ignore
  server.applyMiddleware({ app });

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