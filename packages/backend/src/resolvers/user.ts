import { AuthenticationError } from 'apollo-server-express';

export const userResolvers = {
  Query: {
    users: async (_: any, __: any, { prisma }: any) => {
      return await prisma.user.findMany();
    },
    user: async (_: any, { username }: any, { prisma }: any) => {
      const user = await prisma.user.findUnique({
        where: { username }
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    }
  },
  Mutation: {
    // User mutations would go here (update profile, etc.)
  },
  User: {
    posts: async (parent: any, _: any, { prisma }: any) => {
      return await prisma.post.findMany({
        where: { userId: parent.id },
        orderBy: { createdAt: 'desc' }
      });
    },
    following: async (parent: any, _: any, { prisma }: any) => {
      const follows = await prisma.follow.findMany({
        where: { followerId: parent.id },
        include: { following: true }
      });
      
      return follows.map((follow: any) => follow.following);
    },
    followers: async (parent: any, _: any, { prisma }: any) => {
      const follows = await prisma.follow.findMany({
        where: { followingId: parent.id },
        include: { follower: true }
      });
      
      return follows.map((follow: any) => follow.follower);
    },
    _count: async (parent: any, _: any, { prisma }: any) => {
      const counts = await prisma.user.findUnique({
        where: { id: parent.id },
        select: {
          _count: {
            select: {
              posts: true,
              following: true,
              followers: true
            }
          }
        }
      });
      
      return counts?._count || { posts: 0, following: 0, followers: 0 };
    }
  }
};