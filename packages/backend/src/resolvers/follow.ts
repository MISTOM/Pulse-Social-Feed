import { AuthenticationError } from 'apollo-server-express';

export const followResolvers = {
  Query: {
    // No specific follow queries needed for basic functionality
  },
  Mutation: {
    followUser: async (_: any, { username }: any, { prisma, user }: any) => {
      // Check if user is authenticated
      if (!user) {
        throw new AuthenticationError('You must be logged in to follow a user');
      }

      // Find the user to follow
      const userToFollow = await prisma.user.findUnique({
        where: { username }
      });

      if (!userToFollow) {
        throw new Error('User not found');
      }

      // Cannot follow yourself
      if (userToFollow.id === user.id) {
        throw new Error('You cannot follow yourself');
      }

      // Check if already following
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: userToFollow.id
          }
        }
      });

      if (existingFollow) {
        throw new Error('You are already following this user');
      }

      // Create the follow relationship
      const follow = await prisma.follow.create({
        data: {
          followerId: user.id,
          followingId: userToFollow.id
        },
        include: {
          follower: true,
          following: true
        }
      });

      return follow;
    },
    unfollowUser: async (_: any, { username }: any, { prisma, user }: any) => {
      // Check if user is authenticated
      if (!user) {
        throw new AuthenticationError('You must be logged in to unfollow a user');
      }

      // Find the user to unfollow
      const userToUnfollow = await prisma.user.findUnique({
        where: { username }
      });

      if (!userToUnfollow) {
        throw new Error('User not found');
      }

      // Check if following
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: userToUnfollow.id
          }
        }
      });

      if (!follow) {
        throw new Error('You are not following this user');
      }

      // Delete the follow relationship
      await prisma.follow.delete({
        where: {
          id: follow.id
        }
      });

      return userToUnfollow;
    }
  }
};