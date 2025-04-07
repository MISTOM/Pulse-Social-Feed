import { AuthenticationError } from 'apollo-server-express';

export const likeResolvers = {
  Query: {
    // No specific like queries needed for basic functionality
  },
  Mutation: {
    likePost: async (_: any, { postId }: any, { prisma, user }: any) => {
      // Check if user is authenticated
      if (!user) {
        throw new AuthenticationError('You must be logged in to like a post');
      }

      // Check if the post exists
      const post = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // Check if the user has already liked the post
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: user.id,
            postId
          }
        }
      });

      if (existingLike) {
        throw new Error('You have already liked this post');
      }

      // Create the like
      const like = await prisma.like.create({
        data: {
          userId: user.id,
          postId
        },
        include: {
          user: true,
          post: true
        }
      });

      return like;
    },
    unlikePost: async (_: any, { postId }: any, { prisma, user }: any) => {
      // Check if user is authenticated
      if (!user) {
        throw new AuthenticationError('You must be logged in to unlike a post');
      }

      // Check if the post exists
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { user: true }
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // Check if the user has liked the post
      const like = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: user.id,
            postId
          }
        }
      });

      if (!like) {
        throw new Error('You have not liked this post');
      }

      // Delete the like
      await prisma.like.delete({
        where: {
          id: like.id
        }
      });

      return {
        ...post,
        isLiked: false
      };
    }
  }
};