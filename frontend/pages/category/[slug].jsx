import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PostCard from '../../components/PostCard';
import Link from 'next/link';
import axios from 'axios';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchCategoryPosts();
    }
  }, [slug]);

  const fetchCategoryPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/categories/${slug}`);
      setPosts(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching category posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const categoryTitles = {
    politics: 'Politics & Government',
    culture: 'Culture & Arts',
    travel: 'Travel & Adventure',
    entertainment: 'Entertainment'
  };

  const categoryDescriptions = {
    politics: 'Latest political insights, government updates, and policy analysis',
    culture: 'Arts, trends, cultural stories, and creative expressions',
    travel: 'Discover amazing destinations, travel tips, and cultural experiences',
    entertainment: 'Movies, music, celebrity news, and entertainment updates'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Posts</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link href="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Category Header */}
      <section className="bg-gradient-to-r from-primary to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <nav className="flex justify-center items-center gap-2 text-sm mb-6 text-gray-200">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="capitalize">{slug}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">
            {categoryTitles[slug] || slug}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            {categoryDescriptions[slug] || `Explore all ${slug} articles and insights`}
          </p>
          <div className="mt-6 text-gray-200">
            <span className="bg-red-700 bg-opacity-50 px-4 py-2 rounded-full text-sm">
              {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
            </span>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Articles Yet</h3>
              <p className="text-gray-600 mb-6">
                There are no articles in the {slug} category yet. Check back soon for new content!
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}