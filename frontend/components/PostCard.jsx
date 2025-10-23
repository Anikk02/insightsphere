import React from 'react';
import Link from 'next/link';

export default function PostCard({ post }) {
  // Safety check - make sure post exists and has the right structure
  if (!post || typeof post !== 'object') {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p>Loading post...</p>
      </div>
    );
  }

  // Safely extract values with fallbacks
  const {
    _id = '',
    title = 'Untitled Post',
    slug = '',
    excerpt = 'No description available',
    content = '',
    category = 'uncategorized',
    image = null,
    author = null,
    createdAt = null
  } = post;

  // Safe author handling - author could be string or object
  const authorName = typeof author === 'string' 
    ? author 
    : author?.name || 'Unknown Author';

  return (
    // Change this line to use _id instead of slug
    <Link href={`/post/${_id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer group">
        {image && (
          <div className="h-48 overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium capitalize">
              {category}
            </span>
            <span className="text-gray-500 text-sm">
              {createdAt ? new Date(createdAt).toLocaleDateString() : 'Recent'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 line-clamp-3">
            {excerpt || (content ? content.substring(0, 150) + '...' : 'No content available')}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-primary text-sm font-medium">Read More →</span>
            <span className="text-gray-500 text-sm">By {authorName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}