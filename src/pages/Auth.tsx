import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/userSlice';
import { RootState } from '../store';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedUser = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    about: '',
    customInstructions: ''
  });
  
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Simple local login check
      if (formData.email === storedUser.email && formData.password === storedUser.password) {
        dispatch(setUser({ isAuthenticated: true }));
        navigate('/chat');
      } else if (!storedUser.email) {
        setError('No user found. Please sign up first.');
      } else {
        setError('Invalid email or password.');
      }
    } else {
      // Sign Up
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      
      dispatch(setUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        about: formData.about,
        customInstructions: formData.customInstructions,
        isAuthenticated: true
      }));
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg transition-colors duration-300 p-4">
      <div className="bg-white dark:bg-dark-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="p-8 text-center bg-primary-gradient text-white">
          <h2 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-white/80">
            {isLogin ? 'Enter your credentials to continue' : 'Join MoltBook AI today'}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full pl-10 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                required
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-10 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  required
                />
              </div>
            )}

            {!isLogin && (
              <>
                <div className="relative">
                  <textarea
                    placeholder="About Me (Optional)"
                    value={formData.about}
                    onChange={(e) => setFormData({...formData, about: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all min-h-[80px]"
                  />
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Custom Instructions (Optional)"
                    value={formData.customInstructions}
                    onChange={(e) => setFormData({...formData, customInstructions: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all min-h-[80px]"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary-gradient text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ 
                  username: '', 
                  email: '', 
                  password: '', 
                  confirmPassword: '',
                  about: '',
                  customInstructions: ''
                });
              }}
              className="text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-sm"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
