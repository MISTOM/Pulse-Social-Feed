import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_FEED } from '../utils/graphql';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import { useAuth } from '../context/AuthContext';

const Feed: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { loading, error, data } = useQuery(GET_FEED);

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <div className="text-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <div className="bg-red-50 p-4 rounded-md my-4">
          <p className="text-red-600">Error loading posts: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Feed</h1>
      
      {isAuthenticated ? (
        <PostForm />
      ) : (
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <p className="text-blue-600">Sign in to create posts and like content.</p>
        </div>
      )}

      {data && data.feed.length > 0 ? (
        data.feed.map((post: any) => (
          <Post
            key={post.id}
            id={post.id}
            content={post.content}
            createdAt={post.createdAt}
            isLiked={post.isLiked}
            likesCount={post._count.likes}
            username={post.user.username}
            name={post.user.name}
          />
        ))
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No posts yet. Be the first to share something!</p>
        </div>
      )}
    </div>
  );
};

export default Feed;