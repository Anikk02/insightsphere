import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, User, LogOut, Settings, Eye, EyeOff } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      const adminToken = localStorage.getItem('adminToken');
      const adminUser = localStorage.getItem('adminUser');
      
      if (userData && userData !== 'undefined' && userData !== 'null') {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          localStorage.removeItem('user');
        }
      }
      
      if (adminToken && adminToken !== 'undefined' && adminUser && adminUser !== 'undefined') {
        try {
          const parsedAdminUser = JSON.parse(adminUser);
          setIsAdmin(true);
        } catch (parseError) {
          console.error('Error parsing admin user data:', parseError);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      }
    } catch (error) {
      console.error('Error in Navbar auth check:', error);
    }
  }, []);

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', open);
    setOpen(!open);
  };

  const handleUserLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    setUser(null);
    setOpen(false);
    router.push('/');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAdmin(false);
    setOpen(false);
    router.push('/');
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoginLoading(true);
    setAdminLoginError('');

    try {
      console.log('Attempting admin login with:', { email: adminEmail, password: adminPassword });
      
      const response = await fetch('http://localhost:5000/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const AUTHORIZED_ADMINS = ['aniket@insightsphere.com', 'aniketpaswan02082021@gmail.com'];
        const userEmail = data.user?.email?.toLowerCase();
        
        if (!AUTHORIZED_ADMINS.includes(userEmail)) {
          setAdminLoginError('Access denied. This admin panel is restricted.');
          return;
        }

        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        setIsAdmin(true);
        setShowAdminLogin(false);
        setAdminEmail('');
        setAdminPassword('');
        setAdminLoginError('');
        router.push('/admin');
      } else {
        setAdminLoginError(data.message || 'Admin login failed');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setAdminLoginError('Admin login failed. Please try again.');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const quickAdminLogin = () => {
    const testToken = 'test-admin-token-' + Date.now();
    const testUser = {
      name: 'Aniket Paswan',
      email: 'aniket@insightsphere.com',
      role: 'admin'
    };
    
    localStorage.setItem('adminToken', testToken);
    localStorage.setItem('adminUser', JSON.stringify(testUser));
    setIsAdmin(true);
    setShowAdminLogin(false);
    setAdminEmail('');
    setAdminPassword('');
    router.push('/admin');
  };

  const resetAdminLogin = () => {
    setAdminEmail('');
    setAdminPassword('');
    setAdminLoginError('');
    setShowAdminLogin(false);
    setShowPassword(false);
  };

  const clearInvalidData = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setUser(null);
      setIsAdmin(false);
      console.log('Cleaned up invalid localStorage data');
      window.location.reload();
    } catch (error) {
      console.error('Error clearing invalid data:', error);
    }
  };

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-wide text-white hover:text-gray-200 transition-colors">
          InsightSphere
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-medium items-center">
          <Link href="/" className="text-white hover:text-gray-200 transition-colors">Home</Link>
          <Link href="/category/politics" className="text-white hover:text-gray-200 transition-colors">Politics</Link>
          <Link href="/category/culture" className="text-white hover:text-gray-200 transition-colors">Culture</Link>
          <Link href="/category/travel" className="text-white hover:text-gray-200 transition-colors">Travel</Link>
          <Link href="/category/entertainment" className="text-white hover:text-gray-200 transition-colors">Entertainment</Link>
          <Link href="/about" className="text-white hover:text-gray-200 transition-colors">About</Link>
          <Link href="/contact" className="text-white hover:text-gray-200 transition-colors">Contact</Link>
          
          {/* User Authentication Section */}
          <div className="flex items-center space-x-4 ml-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <User size={16} />
                  <span className="text-sm">Hi, {user.name}</span>
                </div>
                <button
                  onClick={handleUserLogout}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login" 
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Admin Section */}
            {isAdmin ? (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/admin" 
                  className="bg-yellow-500 text-gray-800 px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center space-x-2"
                >
                  <Settings size={16} />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={handleAdminLogout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Admin Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors font-medium"
              >
                Admin Access
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button - Fixed z-index */}
        <div className="md:hidden cursor-pointer text-white relative z-60" onClick={toggleMenu}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>

      {/* Admin Login Modal - Fixed z-index */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" style={{zIndex: 100}}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Admin Login</h3>
            
            {adminLoginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {adminLoginError}
              </div>
            )}
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="aniket@insightsphere.com"
                  required
                  autoComplete="email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={adminLoginLoading}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-red-700 transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] font-medium disabled:opacity-50"
                >
                  {adminLoginLoading ? 'Logging in...' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={resetAdminLogin}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-all hover:shadow-[0_0_15px_rgba(156,163,175,0.7)]"
                >
                  Cancel
                </button>
              </div>
              <button 
            type="button"
            onClick={() => router.push('/')}
            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium mt-4"
          >
            ← Back to Site
          </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-primary border-t border-red-900 absolute top-full left-0 right-0 z-50">
          <div className="flex flex-col py-3 space-y-1">
            <Link href="/" onClick={toggleMenu} className="py-3 px-4 text-white hover:bg-red-800 transition-colors">Home</Link>
            <Link href="/category/politics" onClick={toggleMenu} className="py-3 px-4 text-white hover:bg-red-800 transition-colors">Politics</Link>
            <Link href="/category/culture" onClick={toggleMenu} className="py-3 px-4 text-white hover:bg-red-800 transition-colors">Culture</Link>
            <Link href="/category/travel" onClick={toggleMenu} className="py-3 px-4 text-white hover:bg-red-800 transition-colors">Travel</Link>
            <Link href="/category/entertainment" onClick={toggleMenu} className="py-3 px-4 text-white hover:bg-red-800 transition-colors">Entertainment</Link>
            <Link href="/about" onClick={toggleMenu} className="py-3 px-4 text-white hover:bg-red-800 transition-colors">About</Link>
            <Link href="/contact" onClick={toggleMenu} className="py-3 px-4 text-white hover:bg-red-800 transition-colors">Contact</Link>
            
            {/* User Authentication - Mobile */}
            <div className="border-t border-red-800 pt-3 mt-2">
              {user ? (
                <div className="px-4 space-y-2">
                  <div className="flex items-center space-x-2 text-white py-2">
                    <User size={16} />
                    <span>Hi, {user.name}</span>
                  </div>
                  <button
                    onClick={handleUserLogout}
                    className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="px-4 space-y-2">
                  <Link 
                    href="/login" 
                    onClick={toggleMenu}
                    className="block w-full bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors text-center"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    onClick={toggleMenu}
                    className="block w-full bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors text-center font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              {/* Admin Section - Mobile */}
              <div className="border-t border-red-800 pt-3 mt-3">
                {isAdmin ? (
                  <div className="px-4 space-y-2">
                    <Link 
                      href="/admin" 
                      onClick={toggleMenu}
                      className="block w-full bg-yellow-500 text-gray-800 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-colors text-center font-medium"
                    >
                      Admin Panel
                    </Link>
                    <button
                      onClick={handleAdminLogout}
                      className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-center"
                    >
                      Admin Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAdminLogin(true);
                      setOpen(false);
                    }}
                    className="w-full mx-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors text-center"
                  >
                    Admin Access
                  </button>
                )}
              </div>
              
              <div className="px-4 pt-3">
                <button
                  onClick={clearInvalidData}
                  className="w-full bg-red-500 text-white py-2 rounded-lg text-sm"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}