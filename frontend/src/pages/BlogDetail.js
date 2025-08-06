import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BlogDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await blogAPI.getBlog(id);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        if (error.response?.status === 404) {
          setError('Blog not found.');
        } else {
          setError('Failed to load blog. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    
    try {
      await blogAPI.deleteBlog(id);
      navigate('/my-blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} style={{ marginBottom: '1rem' }}>
        {paragraph}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error" style={{ margin: '2rem auto', maxWidth: '600px' }}>
          {error}
        </div>
        <div className="text-center">
          <Link to="/blogs" className="btn">
            Back to All Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container">
        <div className="text-center" style={{ padding: '2rem' }}>
          <p>Blog not found.</p>
          <Link to="/blogs" className="btn">
            Back to All Blogs
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = isAuthenticated && user && blog.author && user.id === blog.author._id;

  return (
    <div className="container">
      <article style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* Navigation */}
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            to="/blogs" 
            style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem' }}
          >
            ← Back to All Blogs
          </Link>
        </div>

        {/* Blog Header */}
        <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem', 
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            {blog.title}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ color: '#6b7280' }}>
              By <strong style={{ color: '#374151' }}>{blog.author?.name || 'Anonymous'}</strong>
            </div>
            <div style={{ color: '#6b7280' }}>
              Published on {formatDate(blog.createdAt)}
            </div>
            {blog.updatedAt !== blog.createdAt && (
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                (Updated {formatDate(blog.updatedAt)})
              </div>
            )}
          </div>

          {/* Author Actions */}
          {isAuthor && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link 
                to={`/edit-blog/${blog._id}`} 
                className="btn btn-secondary"
                style={{ fontSize: '0.9rem' }}
              >
                Edit Blog
              </Link>
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
                style={{ fontSize: '0.9rem' }}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Blog'}
              </button>
            </div>
          )}
        </header>

        {/* Blog Content */}
        <div className="blog-content" style={{ 
          fontSize: '1.125rem', 
          lineHeight: '1.8',
          color: '#374151'
        }}>
          {formatContent(blog.content)}
        </div>

        {/* Footer */}
        <footer style={{ 
          marginTop: '3rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <Link to="/blogs" className="btn">
              Read More Blogs
            </Link>
          </div>
          
          {!isAuthenticated && (
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none' }}>
                Sign up
              </Link>
              {' '}to start writing your own blogs!
            </p>
          )}
        </footer>
      </article>
    </div>
  );
};

export default BlogDetail;