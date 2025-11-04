import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    try {
      await register(email, password, refCode || '');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center py-10"
    >
      <div className="card" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="text-center mb-6">
          <h1 className="mb-2">Create Your Account</h1>
          <p className="text-sm text-gray-600">
            Join us to start earning referral credits
          </p>
        </div>

        {refCode && (
          <div className="badge" style={{ marginBottom: '1.5rem', display: 'block', textAlign: 'center' }}>
            🎉 Referred by: <strong>{refCode}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="section-title" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label className="section-title" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="section-title" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            Create Account
          </button>
        </form>

        <div style={{ 
          marginTop: '1.5rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue">Sign in here</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}