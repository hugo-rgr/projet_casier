import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Lock, Sparkles, Mail, CheckCircle } from 'lucide-react';

export const EmailVerificationPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state (passed from registration)
  const email = location.state?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required. Please go back to registration.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.verifyEmail(email, code);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-6">
            <div className="relative p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>
          <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Email Verified Successfully!
          </h2>
          <p className="text-center text-lg text-gray-600 mb-8">
            Your email has been verified. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Mail className="h-12 w-12 text-white" />
            <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Verify Your Email
        </h2>
        <p className="text-center text-lg text-gray-600">
          We've sent a verification code to{' '}
          <span className="font-semibold text-blue-600">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="py-10 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <Input
                label="Verification Code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="Enter the 6-digit code"
                className="h-12 text-center text-lg font-mono tracking-widest"
                maxLength={6}
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Verify Email
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    onClick={() => {
                      // TODO: Implement resend verification code
                      alert('Resend functionality will be implemented');
                    }}
                  >
                    Resend
                  </button>
                </p>
              </div>

              <div className="text-center">
                <Link
                  to="/register"
                  className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  ← Back to Registration
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};