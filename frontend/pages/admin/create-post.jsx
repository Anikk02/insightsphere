import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../../components/Navbar';

export default function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'politics',
    tags: '',
    image: '', // This will store the image URL after upload
    featured: false,
    published: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check if user is authenticated with JWT token
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (token && userData) {
      const user = JSON.parse(userData);
      setUser(user);
      setAuthenticated(true);
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  // Handle file upload to your existing upload endpoint
const handleFileUpload = async (file) => {
  const uploadFormData = new FormData();
  uploadFormData.append('image', file);

  try {
    let token = localStorage.getItem('adminToken');
    
    // Check if token exists
    if (!token) {
      console.error('❌ No adminToken found in localStorage');
      throw new Error('Please log in again');
    }

    // ✅ ADD THIS: Clean the token - remove "Bearer " prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.replace('Bearer ', '');
      console.log('🔧 Removed "Bearer " prefix from token');
    }

    // Validate token format (basic check)
    if (token.length < 10) {
      console.error('❌ Invalid token format');
      localStorage.removeItem('adminToken');
      throw new Error('Invalid session. Please log in again.');
    }

    console.log('📤 Starting Cloudinary upload:', {
      name: file.name,
      size: file.size,
      type: file.type,
      tokenExists: !!token,
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...' // Add this to verify
    });

    const response = await axios.post('http://localhost:5000/api/uploads', uploadFormData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      timeout: 120000,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📊 Network progress: ${progress}%`);
          setUploadProgress(progress);
        }
      },
    });

    console.log('✅ Upload API response:', response.data);

    const imageUrl = response.data.url;
    
    if (!imageUrl) {
      console.error('❌ No URL in response:', response.data);
      throw new Error('Cloudinary did not return image URL');
    }

    console.log('🖼️ Image uploaded successfully:', imageUrl);
    return imageUrl;

  } catch (error) {
    console.error('❌ Upload failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });

    // Handle 401 specifically
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('adminToken');
      
      // Show user-friendly message
      throw new Error('Session expired. Please log in again.');
    } else if (error.response?.status === 413) {
      throw new Error('File too large. Maximum size is 5MB.');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Upload timeout. Please try again.');
    } else {
      throw new Error('Upload failed: ' + error.message);
    }
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setUploadProgress(0);

  try {
    let token = localStorage.getItem('adminToken'); // Use 'let' instead of 'const'
    
    if (!token) {
      throw new Error('Please login again');
    }

    // ✅ Clean the token here too
    if (token.startsWith('Bearer ')) {
      token = token.replace('Bearer ', '');
      console.log('🔧 Removed "Bearer " prefix from token in submit');
    }

    console.log('🔐 Using token:', token.substring(0, 20) + '...');

    let imageUrl = '';
    
    // Upload image if selected
    if (imageFile) {
      console.log('🖼️ Starting image upload...', imageFile.name);
      try {
        imageUrl = await handleFileUpload(imageFile);
        console.log('✅ Image uploaded successfully, URL:', imageUrl);
      } catch (uploadError) {
        console.error('❌ Image upload failed:', uploadError);
        alert('Image upload failed, but post will be published without image');
        imageUrl = '';
      }
    } else {
      console.log('ℹ️ No image selected for upload');
    }

    // Prepare post data WITH image URL
    const postData = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      published: true,
      image: imageUrl
    };

    console.log('📝 Final post data with image URL:', postData);

    const response = await axios.post('http://localhost:5000/api/posts', postData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Post created successfully:', response.data);
    
    if (imageUrl && response.data.post) {
      console.log('🖼️ Post includes image URL:', response.data.post.image);
    }
    
    alert('Post created successfully!' + (imageUrl ? ' (with image)' : ' (without image)'));
    router.push('/admin');

  } catch (error) {
    console.error('❌ Error creating post:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      alert('Authentication failed. Please login again.');
      router.push('/admin/login');
    } else if (error.response?.status === 403) {
      alert('Access denied. Admin privileges required.');
    } else {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  } finally {
    setLoading(false);
    setUploadProgress(0);
  }
};
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's an image file
      if (file.type.startsWith('image/')) {
        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file (JPG, PNG, GIF, etc.)');
        e.target.value = ''; // Reset file input
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create New Post</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter post title"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="url-friendly-slug"
              required
            />
            <p className="text-sm text-gray-500 mt-1">This will be used in the URL</p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {!imageFile ? (
                <div>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-block"
                  >
                    Choose Image
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports: JPG, PNG, GIF, WebP
                  </p>
                </div>
              ) : (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading image...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Brief description of your post (optional)"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="12"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Write your post content here..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="politics">Politics</option>
                <option value="culture">Culture</option>
                <option value="travel">Travel</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="technology, web, development"
              />
              <p className="text-sm text-gray-500 mt-1">Separate with commas</p>
            </div>
          </div>

          {/* Post Options */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Feature this post
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Publish immediately
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
}