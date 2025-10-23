import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import CategoryCard from '../components/CategoryCard';
import axios from 'axios';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(res => {
        console.log('Full API response:', res);
        console.log('Posts data:', res.data);
        
        let postsData = [];
        
        // Handle different response structures
        if (res.data && Array.isArray(res.data.posts)) {
          console.log('Posts are nested in .posts property');
          postsData = res.data.posts;
        } else if (Array.isArray(res.data)) {
          console.log('Posts are direct array');
          postsData = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          console.log('Posts are nested in .data property');
          postsData = res.data.data;
        } else {
          console.log('Unexpected data structure:', res.data);
          setError('Unexpected data format from server');
          postsData = [];
        }

        // Validate each post has required fields
        const validatedPosts = postsData.map((post, index) => {
          // Log each post structure for debugging
          console.log(`Post ${index} structure:`, post);
          
          // Ensure post is an object
          if (!post || typeof post !== 'object') {
            console.warn(`Invalid post at index ${index}:`, post);
            return null;
          }

          // Return validated post with safe defaults
          return {
            _id: post._id || post.id || `temp-${index}`,
            title: String(post.title || 'Untitled Post'),
            slug: String(post.slug || `post-${post._id || index}`),
            excerpt: String(post.excerpt || 'No description available'),
            content: String(post.content || ''),
            category: String(post.category || 'uncategorized'),
            image: post.image || null,
            // Handle author - could be string or object
            author: post.author || 'Unknown Author',
            createdAt: post.createdAt || new Date().toISOString()
          };
        }).filter(post => post !== null); // Remove null posts

        console.log('Validated posts:', validatedPosts);
        setPosts(validatedPosts);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
        console.error('Error response:', err.response?.data);
        setError('Failed to load posts. Please try again later.');
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = [
    { name: 'Politics', slug: 'politics' },
    { name: 'Culture', slug: 'culture' },
    { name: 'Travel', slug: 'travel' },
    { name: 'Entertainment', slug: 'entertainment' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      {/*<header className="bg-gradient-to-br from-primary to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to InsightSphere</h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
            Your gateway to stories, news, and insights across the world
          </p>
        </div>
      </header>*/}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Categories Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Explore Categories</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover content across different topics that matter to you
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <CategoryCard key={i} category={cat} />
            ))}
          </div>
        </section>

        {/* Latest Posts Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Latest Posts</h2>
            <p className="text-gray-600 text-lg">Fresh insights and stories from our writers</p>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && !error && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading posts...</p>
            </div>
          )}

          {/* Success State */}
          {!loading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
                <p className="text-gray-500 text-lg mb-4">No posts available yet</p>
                <p className="text-gray-400">Check back soon for new content!</p>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}