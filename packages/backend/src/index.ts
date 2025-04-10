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
const app = express();

app.use(cors());
// Handle OPTIONS preflight requests
app.options('/*', (req, res) => {
  res.set({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  });
  res.status(204).send();
});
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

// Initialize server synchronously
const initializeServer = async () => {
  await server.start();
  server.applyMiddleware({
    //@ts-ignore
    app,
    path: '/',
    cors: false,
  });

  // Define port for server
  const PORT = process.env.PORT || 4000;

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🔍 Test endpoint available at http://localhost:${PORT}/test`);
  });
};

// Run initialization
initializeServer().catch((error) => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});

// Add a test route to verify Express is running
app.get('/test', (req, res) => {
  res.send('Server is alive!');
});