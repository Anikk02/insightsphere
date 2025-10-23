import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuthenticated');
    if (savedAuth) setAuthenticated(true);
  }, []);

  const handleLogin = () => {
    if (password === 'admin123') { // Change this!
      setAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
    } else {
      alert('Invalid password');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm w-96">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-primary"
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button 
            onClick={handleLogin}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}