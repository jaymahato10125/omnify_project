import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const response = await blogAPI.getBlogs(1, 6);
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error('Error fetching recent blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBlogs();
  }, []);

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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="text-center mt-8 mb-8">
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
          Welcome to Omnify Blog
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Discover amazing stories, insights, and ideas from our community of writers.
          Share your thoughts and connect with readers around the world.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/blogs" className="btn" style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
            Explore All Blogs
          </Link>
          <Link to="/signup" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
            Start Writing
          </Link>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
          Recent Posts
        </h2>
        
        {blogs.length === 0 ? (
          <div className="text-center">
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              No blogs yet. Be the first to write one!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {blogs.map((blog) => (
              <article key={blog._id} className="blog-card">
                <h3 className="blog-title">
                  <Link 
                    to={`/blogs/${blog._id}`} 
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {blog.title}
                  </Link>
                </h3>
                <div className="blog-meta">
                  By {blog.author?.name || 'Anonymous'} • {formatDate(blog.createdAt)}
                </div>
                <p className="blog-excerpt">
                  {truncateContent(blog.content)}
                </p>
                <Link 
                  to={`/blogs/${blog._id}`} 
                  className="btn" 
                  style={{ marginTop: '1rem', display: 'inline-block' }}
                >
                  Read More
                </Link>
              </article>
            ))}
          </div>
        )}

        {blogs.length > 0 && (
          <div className="text-center mt-4">
            <Link to="/blogs" className="btn btn-secondary">
              View All Blogs
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;