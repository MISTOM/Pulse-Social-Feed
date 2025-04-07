import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER, GET_USER_POSTS, FOLLOW_USER, UNFOLLOW_USER } from '../utils/graphql';
import Post from '../components/Post';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { isAuthenticated, user: currentUser } = useAuth();
  const isOwnProfile = currentUser?.username === username;
  
  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER, {
    variables: { username },
    skip: !username
  });
  
  const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_USER_POSTS, {
    variables: { username },
    skip: !username
  });

  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    refetchQueries: [
      { query: GET_USER, variables: { username } }
    ]
  });
  
  const [unfollowUser, { loading: unfollowLoading }] = useMutation(UNFOLLOW_USER, {
    refetchQueries: [
      { query: GET_USER, variables: { username } }
    ]
  });

  if (userLoading || postsLoading) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <div className="text-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (userError || postsError) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <div className="bg-red-50 p-4 rounded-md my-4">
          <p className="text-red-600">
            Error: {userError ? userError.message : postsError?.message}
          </p>
        </div>
      </div>
    );
  }
  
  if (!userData || !userData.user) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <div className="bg-red-50 p-4 rounded-md my-4">
          <p className="text-red-600">User not found</p>
        </div>
      </div>
    );
  }
  
  const user = userData.user;
  const posts = postsData?.userPosts || [];
  
  // Check if current user follows this profile
  const isFollowing = userData.user.followers?.some(
    (follower: any) => follower.id === currentUser?.id
  );
  
  const handleFollowToggle = async () => {
    if (!isAuthenticated) return;
    
    try {
      if (isFollowing) {
        await unfollowUser({ variables: { username } });
      } else {
        await followUser({ variables: { username } });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.name || `@${user.username}`}
            </h1>
            <p className="text-gray-600">@{user.username}</p>
            {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
          </div>
          
          {!isOwnProfile && isAuthenticated && (
            <button
              onClick={handleFollowToggle}
              disabled={followLoading || unfollowLoading}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isFollowing
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {followLoading || unfollowLoading
                ? 'Loading...'
                : isFollowing
                ? 'Unfollow'
                : 'Follow'}
            </button>
          )}
        </div>
        
        <div className="flex mt-4 space-x-4 text-gray-600">
          <div>
            <span className="font-bold">{user._count.posts}</span> Posts
          </div>
          <div>
            <span className="font-bold">{user._count.followers}</span> Followers
          </div>
          <div>
            <span className="font-bold">{user._count.following}</span> Following
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-4">Posts</h2>
      
      {posts.length > 0 ? (
        posts.map((post: any) => (
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
          <p className="text-gray-500">No posts yet</p>
        </div>
      )}
    </div>
  );
};

export default Profile;