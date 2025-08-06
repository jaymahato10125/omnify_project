import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchBlog = async () => {
      setFetchLoading(true);
      
      try {
        const response = await blogAPI.getBlog(id);
        const blog = response.data;
        
        setFormData({
          title: blog.title,
          content: blog.content
        });
        setOriginalData({
          title: blog.title,
          content: blog.content
        });
      } catch (error) {
        console.error('Error fetching blog:', error);
        if (error.response?.status === 404) {
          setErrors({ general: 'Blog not found.' });
        } else if (error.response?.status === 403) {
          setErrors({ general: 'You can only edit your own blogs.' });
        } else {
          setErrors({ general: 'Failed to load blog. Please try again.' });
        }
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

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

  const hasChanges = () => {
    return formData.title !== originalData.title || formData.content !== originalData.content;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!hasChanges()) {
      navigate(`/blogs/${id}`);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await blogAPI.updateBlog(id, {
        title: formData.title.trim(),
        content: formData.content.trim()
      });
      
      // Redirect to the updated blog
      navigate(`/blogs/${id}`);
    } catch (error) {
      console.error('Error updating blog:', error);
      
      if (error.response?.status === 403) {
        setErrors({ general: 'You can only edit your own blogs.' });
      } else if (error.response?.data?.errors) {
        // Handle validation errors from server
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param || 'general'] = err.msg;
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Failed to update blog. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges()) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        navigate(`/blogs/${id}`);
      }
    } else {
      navigate(`/blogs/${id}`);
    }
  };

  if (fetchLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (errors.general && !formData.title && !formData.content) {
    return (
      <div className="container">
        <div className="alert alert-error" style={{ margin: '2rem auto', maxWidth: '600px' }}>
          {errors.general}
        </div>
        <div className="text-center">
          <button onClick={() => navigate(-1)} className="btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
          Edit Blog Post
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
              disabled={loading || !hasChanges()}
            >
              {loading ? 'Updating...' : 'Update Blog'}
            </button>
          </div>

          {hasChanges() && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '0.25rem' }}>
              <p style={{ color: '#92400e', fontSize: '0.875rem', margin: 0 }}>
                You have unsaved changes. Make sure to save before leaving this page.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditBlog;