import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogAPI } from '../services/api';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await blogAPI.getBlogs(currentPage, 10);
        setBlogs(response.data.blogs);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const truncateContent = (content, maxLength = 200) => {
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
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-btn">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
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

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="pagination-btn">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
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
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
          All Blog Posts
        </h1>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center">
            <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '2rem' }}>
              No blogs have been published yet.
            </p>
            <Link to="/create-blog" className="btn">
              Write the First Blog
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#6b7280', textAlign: 'center' }}>
                Showing {pagination.totalBlogs} blog{pagination.totalBlogs !== 1 ? 's' : ''}
                {pagination.totalPages > 1 && ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {blogs.map((blog) => (
                <article key={blog._id} className="blog-card">
                  <h2 className="blog-title" style={{ fontSize: '1.5rem' }}>
                    <Link 
                      to={`/blogs/${blog._id}`} 
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {blog.title}
                    </Link>
                  </h2>
                  
                  <div className="blog-meta" style={{ marginBottom: '1rem' }}>
                    By <strong>{blog.author?.name || 'Anonymous'}</strong> • {formatDate(blog.createdAt)}
                  </div>
                  
                  <p className="blog-excerpt" style={{ marginBottom: '1rem' }}>
                    {truncateContent(blog.content)}
                  </p>
                  
                  <Link 
                    to={`/blogs/${blog._id}`} 
                    className="btn"
                  >
                    Read Full Post
                  </Link>
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

export default BlogList;