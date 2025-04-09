import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// GraphQL queries and mutations
const GET_FOLLOWING = gql`
  query GetFollowing {
    me {
      id
      following {
        id
        username
        name
      }
    }
  }
`;

const UNFOLLOW_USER = gql`
  mutation UnfollowUser($username: String!) {
    unfollowUser(username: $username) {
      id
      username
    }
  }
`;

interface User {
  id: string;
  username: string;
  name?: string;
}

const Following: React.FC = () => {
  const { user } = useAuth();
  const [unfollowError, setUnfollowError] = useState<string | null>(null);
  
  const { loading, error, data, refetch } = useQuery(GET_FOLLOWING);
  
  const [unfollowUser] = useMutation(UNFOLLOW_USER, {
    onError: (error) => {
      setUnfollowError(error.message);
    },
    update: (cache, { data }) => {
      cache.modify({
        id: cache.identify({ __typename: 'User', id: user?.id }),
        fields: {
          following(existingFollowingRefs, { readField }) {
            return existingFollowingRefs.filter(
              (followingRef: any) => readField('id', followingRef) !== data.unfollowUser.id
            );
          },
        },
      });
    },
  });

  const handleUnfollow = async (username: string) => {
    try {
      await unfollowUser({
        variables: { username }
      });
      setUnfollowError(null);
      refetch(); // Refresh the following list
    } catch (err) {
      console.error("Error unfollowing user:", err);
    }
  };

  if (loading) return <div className="container mx-auto px-4 text-center py-8">Loading...</div>;
  
  if (error) return (
    <div className="container mx-auto px-4 text-center py-8">
      Error loading following list: {error.message}
    </div>
  );

  const followingUsers = data?.me?.following || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">People You Follow</h1>
        
        {unfollowError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {unfollowError}
          </div>
        )}
        
        {followingUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">You aren't following anyone yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            {followingUsers.map((user: User) => (
              <div key={user.id} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center">
                  <img 
                    src={'https://via.placeholder.com/40'} 
                    alt={`${user.name || user.username}'s avatar`} 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <Link to={`/profile/${user.username}`} className="font-medium text-blue-600 hover:underline">
                      {user.name || user.username}
                    </Link>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnfollow(user.username)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition duration-150"
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Following;
