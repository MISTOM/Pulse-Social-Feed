import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    username: String!
    name: String
    bio: String
    createdAt: String!
    updatedAt: String!
    posts: [Post!]
    following: [User!]
    followers: [User!]
    _count: UserCount
  }

  type UserCount {
    posts: Int!
    following: Int!
    followers: Int!
  }

  type Post {
    id: ID!
    content: String!
    createdAt: String!
    updatedAt: String!
    user: User!
    likes: [Like!]
    _count: PostCount
    isLiked: Boolean
  }

  type PostCount {
    likes: Int!
  }

  type Like {
    id: ID!
    user: User!
    post: Post!
    createdAt: String!
  }

  type Follow {
    id: ID!
    follower: User!
    following: User!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    user(username: String!): User
    users: [User!]!
    feed: [Post!]!
    userPosts(username: String!): [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    # Authentication
    register(email: String!, username: String!, password: String!, name: String): AuthPayload!
    login(email: String, username: String, password: String!): AuthPayload!

    # Post operations
    createPost(content: String!): Post!
    updatePost(id: ID!, content: String!): Post!
    deletePost(id: ID!): Post!

    # Like operations
    likePost(postId: ID!): Like!
    unlikePost(postId: ID!): Post!

    # Follow operations
    followUser(username: String!): Follow!
    unfollowUser(username: String!): User!
  }
`;