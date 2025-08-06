import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const { name, email, password } = formData;
      await signup({ name, email, password });
      navigate('/');
    } catch (error) {
      if (error.response?.data?.errors) {
        // Handle validation errors from server
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param || 'general'] = err.msg;
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Signup failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
          Create Your Account
        </h1>

        {errors.general && (
          <div className="alert alert-error">
            {errors.general}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Enter your full name"
          />
          {errors.name && (
            <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.name}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Enter your email"
          />
          {errors.email && (
            <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.email}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Create a password (min. 6 characters)"
          />
          {errors.password && (
            <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.password}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn" 
          style={{ width: '100%', marginBottom: '1rem' }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p style={{ textAlign: 'center', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;