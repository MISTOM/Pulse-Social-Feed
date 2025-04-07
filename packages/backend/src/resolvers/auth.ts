import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { generateToken, hashPassword, verifyPassword } from '../utils/auth';

export const authResolvers = {
  Query: {
    me: async (_: any, __: any, { prisma, user }: any) => {
      // Check if user is authenticated
      if (!user) {
        return null;
      }
      
      // Return the authenticated user
      return await prisma.user.findUnique({
        where: { id: user.id }
      });
    }
  },
  Mutation: {
    register: async (_: any, { email, username, password, name }: any, { prisma }: any) => {
      // Check if email already exists
      const existingEmail = await prisma.user.findUnique({
        where: { email }
      });

      if (existingEmail) {
        throw new UserInputError('Email already in use');
      }

      // Check if username already exists
      const existingUsername = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUsername) {
        throw new UserInputError('Username already taken');
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          name
        }
      });

      // Generate token
      const token = generateToken(user.id);

      // Return token and user
      return {
        token,
        user
      };
    },
    login: async (_: any, { email, username, password }: any, { prisma }: any) => {
      let user;

      // Find user by email or username
      if (email) {
        user = await prisma.user.findUnique({
          where: { email }
        });
      } else if (username) {
        user = await prisma.user.findUnique({
          where: { username }
        });
      } else {
        throw new UserInputError('You must provide an email or username');
      }

      // Check if user exists
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Generate token
      const token = generateToken(user.id);

      // Return token and user
      return {
        token,
        user
      };
    }
  }
};