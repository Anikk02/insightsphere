import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Define your specific admin email(s)
  const AUTHORIZED_ADMINS = [
    'aniket@insightsphere.com',
    'aniketpaswan02082021@gmail.com'
  ];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const userData = localStorage.getItem('adminUser');
      
      console.log('🔐 Admin Dashboard Auth Check:', {
        hasToken: !!token,
        hasUserData: !!userData,
        tokenLength: token?.length,
        userData: userData
      });
      
      if (!token || !userData) {
        console.log('❌ No admin token or user data found');
        router.push('/admin/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        console.log('👤 Parsed user:', parsedUser);
        
        // Check if the user is specifically you
        const userEmail = parsedUser.email?.toLowerCase().trim();
        const isAuthorized = AUTHORIZED_ADMINS.includes(userEmail);
        
        console.log('✅ Is authorized admin?', isAuthorized, 'Email:', userEmail);
        
        if (isAuthorized) {
          setUser(parsedUser);
          setAuthenticated(true);
          setAccessDenied(false);
        } else {
          console.log('🚫 Access denied - not an authorized admin');
          setAccessDenied(true);
          setAuthenticated(false);
          // Clear invalid tokens
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        // Clear corrupted data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    console.log('👋 Admin logging out');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied message
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              This admin panel is restricted to authorized personnel only.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Authorized emails: {AUTHORIZED_ADMINS.join(', ')}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/login')}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Different Login
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show content only when authenticated and authorized
  if (!authenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-gray-600">
                  Welcome back, <strong>{user?.name || 'Admin'}</strong>
                </p>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  ✓ Authorized Admin
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Posts</p>
                <p className="text-2xl font-bold text-gray-800">--</p>
              </div>
              <div className="text-2xl">📝</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Published</p>
                <p className="text-2xl font-bold text-gray-800">--</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Drafts</p>
                <p className="text-2xl font-bold text-gray-800">--</p>
              </div>
              <div className="text-2xl">📋</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Post */}
          <div 
            onClick={() => navigateTo('/admin/create-post')}
            className="bg-white rounded-xl shadow-sm p-6 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">✨</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Create New Post</h3>
            <p className="text-gray-600">Write and publish a new article</p>
            <div className="mt-4 text-sm text-blue-600 font-medium">Get Started →</div>
          </div>

          {/* Manage Posts */}
          <div 
            onClick={() => navigateTo('/admin/manage-posts')}
            className="bg-white rounded-xl shadow-sm p-6 border-2 border-dashed border-gray-300 hover:border-green-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Posts</h3>
            <p className="text-gray-600">Edit, delete or view existing posts</p>
            <div className="mt-4 text-sm text-green-600 font-medium">Manage Content →</div>
          </div>

          {/* Analytics */}
          <div 
            className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-200 cursor-not-allowed group opacity-70"
          >
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics</h3>
            <p className="text-gray-600">View site statistics and insights</p>
            <div className="mt-4 text-sm text-gray-500 font-medium">Coming Soon</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500 text-center py-8">
              No recent activity to display. Create your first post to get started!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}