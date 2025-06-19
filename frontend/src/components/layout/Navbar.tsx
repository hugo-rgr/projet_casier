import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Lock, User, LogOut, Shield, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Lock className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
                <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LockerHub
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/lockers"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
            >
              Browse Lockers
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
                >
                  Dashboard
                </Link>
                
                <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {user.firstname} {user.lastname}
                      </span>
                      <div className="flex items-center space-x-1">
                        {user.role === 'admin' && (
                          <div className="flex items-center space-x-1">
                            <Shield className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">Admin</span>
                          </div>
                        )}
                        {/* Only show unverified status if email is NOT verified */}
                        {user.is_email_verified && (
                          <span className="text-xs text-amber-600 font-medium">Unverified</span>
                        )}
                        {/* Show verified status if email IS verified */}
                        {user.is_email_verified && (
                          <span className="text-xs text-green-600 font-medium">Verified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
