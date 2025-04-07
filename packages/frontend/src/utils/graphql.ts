import { gql } from '@apollo/client';

// Auth Queries & Mutations
export const LOGIN = gql`
  mutation Login($email: String, $username: String, $password: String!) {
    login(email: $email, username: $username, password: $password) {
      token
      user {
        id
        email
        username
        name
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($email: String!, $username: String!, $password: String!, $name: String) {
    register(email: $email, username: $username, password: $password, name: $name) {
      token
      user {
        id
        email
        username
        name
      }
    }
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      id
      email
      username
      name
      bio
      createdAt
      _count {
        posts
        followers
        following
      }
    }
  }
`;

// Post Queries & Mutations
export const GET_FEED = gql`
  query Feed {
    feed {
      id
      content
      createdAt
      isLiked
      user {
        id
        username
        name
      }
      _count {
        likes
      }
    }
  }
`;

export const GET_USER_POSTS = gql`
  query UserPosts($username: String!) {
    userPosts(username: $username) {
      id
      content
      createdAt
      isLiked
      user {
        id
        username
        name
      }
      _count {
        likes
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($content: String!) {
    createPost(content: $content) {
      id
      content
      createdAt
      user {
        id
        username
        name
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      post {
        id
      }
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: ID!) {
    unlikePost(postId: $postId) {
      id
      isLiked
    }
  }
`;

// User Queries & Mutations
export const GET_USER = gql`
  query User($username: String!) {
    user(username: $username) {
      id
      username
      name
      bio
      createdAt
      _count {
        posts
        followers
        following
      }
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($username: String!) {
    followUser(username: $username) {
      id
      follower {
        id
        username
      }
      following {
        id
        username
      }
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($username: String!) {
    unfollowUser(username: $username) {
      id
      username
    }
  }
`;