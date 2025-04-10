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

  app.use(cors());


  // Handle OPTIONS preflight requests explicitly
  // app.options('*', (req, res) => {
  //   // Set CORS headers explicitly
  //   res.header('Access-Control-Allow-Origin', req.headers.origin);
  //   res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   res.status(204).end();
  // });

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
    //@ts-ignore
    app,
    path: '/',
    cors: false
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