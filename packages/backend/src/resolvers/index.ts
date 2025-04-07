import { authResolvers } from './auth';
import { postResolvers } from './post';
import { userResolvers } from './user';
import { likeResolvers } from './like';
import { followResolvers } from './follow';

// Merge all resolvers
export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...postResolvers.Query,
    ...userResolvers.Query,
    ...likeResolvers.Query,
    ...followResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...postResolvers.Mutation,
    ...userResolvers.Mutation,
    ...likeResolvers.Mutation,
    ...followResolvers.Mutation
  },
  User: userResolvers.User,
  Post: postResolvers.Post
};