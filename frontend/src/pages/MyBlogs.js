import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyBlogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchMyBlogs = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await blogAPI.getMyBlogs(currentPage, 10);
        setBlogs(response.data.blogs);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Error fetching my blogs:', error);
        setError('Failed to load your blogs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [currentPage]);

  const handleDelete = async (blogId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(blogId);
    
    try {
      await blogAPI.deleteBlog(blogId);
      // Remove the deleted blog from the list
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      
      // Update pagination count
      setPagination(prev => ({
        ...prev,
        totalBlogs: prev.totalBlogs - 1
      }));
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderPagination = () => {
    if (!pagination.totalPages || pagination.totalPages <= 1) return null;

    const pages = [];
    const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;

    // Previous button
    if (hasPrevPage) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-btn"
        >
          Previous
        </button>
      );
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (hasNextPage) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-btn"
        >
          Next
        </button>
      );
    }

    return <div className="pagination">{pages}</div>;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ color: '#1f2937' }}>
            My Blog Posts
          </h1>
          <Link to="/create-blog" className="btn">
            Write New Blog
          </Link>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center">
            <div style={{ background: 'white', padding: '3rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ color: '#6b7280', marginBottom: '1rem' }}>
                You haven't written any blogs yet
              </h3>
              <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
                Start sharing your thoughts and ideas with the world!
              </p>
              <Link to="/create-blog" className="btn">
                Write Your First Blog
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#6b7280' }}>
                You have written {pagination.totalBlogs} blog{pagination.totalBlogs !== 1 ? 's' : ''}
                {pagination.totalPages > 1 && ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {blogs.map((blog) => (
                <article key={blog._id} className="blog-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h2 className="blog-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        <Link 
                          to={`/blogs/${blog._id}`} 
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {blog.title}
                        </Link>
                      </h2>
                      
                      <div className="blog-meta" style={{ marginBottom: '1rem' }}>
                        Published on {formatDate(blog.createdAt)}
                        {blog.updatedAt !== blog.createdAt && (
                          <span> • Updated {formatDate(blog.updatedAt)}</span>
                        )}
                      </div>
                      
                      <p className="blog-excerpt" style={{ marginBottom: '1rem' }}>
                        {truncateContent(blog.content)}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 'fit-content' }}>
                      <Link 
                        to={`/blogs/${blog._id}`} 
                        className="btn btn-secondary"
                        style={{ fontSize: '0.875rem', textAlign: 'center' }}
                      >
                        View
                      </Link>
                      <Link 
                        to={`/edit-blog/${blog._id}`} 
                        className="btn btn-secondary"
                        style={{ fontSize: '0.875rem', textAlign: 'center' }}
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(blog._id, blog.title)}
                        className="btn btn-danger"
                        style={{ fontSize: '0.875rem' }}
                        disabled={deleteLoading === blog._id}
                      >
                        {deleteLoading === blog._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;