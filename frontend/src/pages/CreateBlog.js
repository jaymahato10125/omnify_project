import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await blogAPI.createBlog({
        title: formData.title.trim(),
        content: formData.content.trim()
      });
      
      // Redirect to the newly created blog
      navigate(`/blogs/${response.data.blog._id}`);
    } catch (error) {
      console.error('Error creating blog:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors from server
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param || 'general'] = err.msg;
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Failed to create blog. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.title.trim() || formData.content.trim()) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
          Write a New Blog Post
        </h1>

        {errors.general && (
          <div className="alert alert-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter an engaging title for your blog post"
              maxLength="200"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
              {errors.title && (
                <div style={{ color: '#dc2626', fontSize: '0.875rem' }}>
                  {errors.title}
                </div>
              )}
              <div style={{ color: '#6b7280', fontSize: '0.875rem', marginLeft: 'auto' }}>
                {formData.title.length}/200
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Blog Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Write your blog content here... You can use multiple paragraphs by pressing Enter twice."
              rows="15"
              style={{ minHeight: '400px' }}
            />
            {errors.content && (
              <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.content}
              </div>
            )}
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {formData.content.length} characters
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button 
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn"
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish Blog'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#374151' }}>
            Writing Tips:
          </h3>
          <ul style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
            <li>Write a compelling title that captures the essence of your post</li>
            <li>Break your content into paragraphs for better readability</li>
            <li>Use simple, clear language that's easy to understand</li>
            <li>Tell a story or share insights that provide value to readers</li>
            <li>Proofread your content before publishing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;