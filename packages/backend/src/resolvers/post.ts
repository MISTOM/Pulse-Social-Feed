import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

export const postResolvers = {
  Query: {
    feed: async (_: any, __: any, { prisma, user }: any) => {
      // Get the most recent posts, limit to 20 for simplicity
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 20,
        include: {
          user: true,
          _count: {
            select: { likes: true }
          }
        }
      });

      // If user is authenticated, check if they liked any of these posts
      if (user) {
        const postIds = posts.map((post: any) => post.id);
        
        const userLikes = await prisma.like.findMany({
          where: {
            userId: user.id,
            postId: { in: postIds }
          }
        });
        
        const likedPostIds = new Set(userLikes.map((like: any) => like.postId));
        
        return posts.map((post: any) => ({
          ...post,
          isLiked: likedPostIds.has(post.id)
        }));
      }

      return posts;
    },
    userPosts: async (_: any, { username }: any, { prisma, user }: any) => {
      const targetUser = await prisma.user.findUnique({
        where: { username }
      });

      if (!targetUser) {
        throw new Error('User not found');
      }

      const posts = await prisma.post.findMany({
        where: {
          userId: targetUser.id
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: true,
          _count: {
            select: { likes: true }
          }
        }
      });

      // If user is authenticated, check if they liked any of these posts
      if (user) {
        const postIds = posts.map((post: any) => post.id);
        
        const userLikes = await prisma.like.findMany({
          where: {
            userId: user.id,
            postId: { in: postIds }
          }
        });
        
        const likedPostIds = new Set(userLikes.map((like: any) => like.postId));
        
        return posts.map((post: any) => ({
          ...post,
          isLiked: likedPostIds.has(post.id)
        }));
      }

      return posts;
    },
    post: async (_: any, { id }: any, { prisma, user }: any) => {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          user: true,
          _count: {
            select: { likes: true }
          }
        }
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // If user is authenticated, check if they liked this post
      if (user) {
        const like = await prisma.like.findUnique({
          where: {
            userId_postId: {
              userId: user.id,
              postId: id
            }
          }
        });
        
        return {
          ...post,
          isLiked: Boolean(like)
        };
      }

      return post;
    }
  },
  Mutation: {
    createPost: async (_: any, { content }: any, { prisma, user }: any) => {
      // Check if user is authenticated
      if (!user) {
        throw new AuthenticationError('You must be logged in to create a post');
      }

      // Create the post
      const post = await prisma.post.create({
        data: {
          content,
          userId: user.id
        },
        include: {
          user: true,
          _count: {
            select: { likes: true }
          }
        }
      });

      return post;
    },
    updatePost: async (_: any, { id, content }: any, { prisma, user }: any) => {
      // Check if user is authenticated
      if (!user) {
        throw new AuthenticationError('You must be logged in to update a post');
      }

      // Find the post
      const post = await prisma.post.findUnique({
        where: { id }
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // Check if user owns the post
      if (post.userId !== user.id) {
        throw new ForbiddenError('You can only update your own posts');
      }

      // Update the post
      const updatedPost = await prisma.post.update({
        where: { id },
        data: { content },
        include: {
          user: true,
          _count: {
            select: { likes: true }
          }
        }
      });

      return updatedPost;
    },
    deletePost: async (_: any, { id }: any, { prisma, user }: any) => {
      // Check if user is authenticated
      if (!user) {
        throw new AuthenticationError('You must be logged in to delete a post');
      }

      // Find the post
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          user: true
        }
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // Check if user owns the post
      if (post.userId !== user.id) {
        throw new ForbiddenError('You can only delete your own posts');
      }

      // Delete the post
      await prisma.post.delete({
        where: { id }
      });

      return post;
    }
  },
  Post: {
    user: async (parent: any, _: any, { prisma }: any) => {
      if (parent.user) {
        return parent.user;
      }

      return await prisma.user.findUnique({
        where: { id: parent.userId }
      });
    },
    likes: async (parent: any, _: any, { prisma }: any) => {
      return await prisma.like.findMany({
        where: { postId: parent.id },
        include: { user: true }
      });
    }
  }
};