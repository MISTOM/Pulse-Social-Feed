import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LIKE_POST, UNLIKE_POST } from '../utils/graphql';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface PostProps {
  id: string;
  content: string;
  createdAt: string;
  isLiked?: boolean;
  likesCount: number;
  username: string;
  name?: string;
}

const Post: React.FC<PostProps> = ({ 
  id, 
  content, 
  createdAt, 
  isLiked = false, 
  likesCount, 
  username, 
  name 
}) => {
  const { isAuthenticated } = useAuth();
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const [liked, setLiked] = React.useState(isLiked);
  const [likes, setLikes] = React.useState(likesCount);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) return;
    
    try {
      if (liked) {
        await unlikePost({ variables: { postId: id } });
        setLikes(likes - 1);
      } else {
        await likePost({ variables: { postId: id } });
        setLikes(likes + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Fix for the date formatting issue
  const formatDate = () => {
    try {
      // Parse the ISO date string first
      const date = parseISO(createdAt);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'recently'; // Fallback value
    }
  };

  const formattedDate = formatDate();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-start">
        <Link to={`/profile/${username}`} className="text-blue-600 font-medium hover:underline">
          {name || username}
        </Link>
        <span className="text-gray-500 text-sm">{formattedDate}</span>
      </div>
      <p className="mt-2 text-gray-700">{content}</p>
      <div className="mt-4 flex justify-between items-center">
        <button 
          onClick={handleLikeToggle}
          disabled={!isAuthenticated}
          className={`flex items-center ${liked ? 'text-red-500' : 'text-gray-500'} ${isAuthenticated ? 'hover:text-red-500' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span>{likes}</span>
        </button>
        <Link to={`/profile/${username}`} className="text-blue-600 text-sm hover:underline">
          @{username}
        </Link>
      </div>
    </div>
  );
};

export default Post;