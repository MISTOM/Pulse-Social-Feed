import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_POST, GET_FEED } from '../utils/graphql';

const PostForm: React.FC = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_FEED }],
    onError: (error) => {
      setError(error.message);
    },
    onCompleted: () => {
      setContent('');
      setError(null);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return setError('Post cannot be empty');
    }
    
    createPost({ variables: { content } });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{error && <span className="text-red-500">{error}</span>}</span>
            <span>{content.length}/280 characters</span>
          </div>
        </div>
        <div className="text-right">
          <button
            type="submit"
            disabled={loading || content.trim() === ''}
            className={`py-2 px-4 rounded-md font-medium ${
              loading || content.trim() === ''
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;