import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching post with ID/slug:', id);
        
        // First try to fetch by ID (assuming it's a MongoDB ID)
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          try {
            const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
            setPost(response.data);
            return;
          } catch (err) {
            console.log('Not found by ID, trying as slug...');
          }
        }
        
        // If not found by ID or not a valid ID format, try as slug
        const allPostsResponse = await axios.get('http://localhost:5000/api/posts');
        const foundPost = allPostsResponse.data.find(p => p.slug === id || p._id === id);
        
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Post not found');
        }
        
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The post you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const authorName = typeof post.author === 'string' 
    ? post.author 
    : post.author?.name || 'Unknown Author';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-xl shadow-sm p-8">
          {/* Post Header */}
          <header className="mb-8 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                {post.category || 'Uncategorized'}
              </span>
              <span className="text-gray-500 text-sm">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {post.title || 'Untitled Post'}
            </h1>
            
            <div className="flex items-center text-gray-600">
              <span>By {authorName}</span>
            </div>
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8 w-full aspect-video rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            {post.content ? (
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            ) : (
              <p className="text-gray-500 italic">No content available for this post.</p>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push('/')}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back to All Posts
            </button>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}