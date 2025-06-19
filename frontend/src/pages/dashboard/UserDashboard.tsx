import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Package, Calendar, DollarSign, Clock, CreditCard, Mail, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { Reservation } from '../../types';

export const UserDashboard: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await apiService.getUserReservations();
      setReservations(data);
    } catch (error) {
      console.error('Failed to load reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    setCancellingId(reservationId);
    try {
      await apiService.cancelReservation(reservationId);
      await loadReservations(); // Reload to get updated data
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
      alert('Failed to cancel reservation. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const activeReservations = reservations.filter(r => r.paymentStatus === 'paid');
  const totalSpent = reservations.filter(r => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.totalPrice, 0);
  const pendingPayments = reservations.filter(r => r.paymentStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.firstname}! 👋
          </h1>
          <p className="text-xl text-gray-600">Manage your locker reservations and account</p>
        </div>

        {/* Email Verification Alert - Only show if email is NOT verified */}
        {user && user.is_email_verified && (
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-800">Email Verification Required</h3>
                  <p className="text-amber-700">Please check your email and verify your account to access all features.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Reservations</p>
                  <p className="text-3xl font-bold">{activeReservations.length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Package className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Spent</p>
                  <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <DollarSign className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Reservations</p>
                  <p className="text-3xl font-bold">{reservations.length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Calendar className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Pending Payments</p>
                  <p className="text-3xl font-bold">{pendingPayments}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <CreditCard className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Reservations</h2>
              <Button 
                onClick={() => window.location.href = '/lockers'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Browse Lockers
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No reservations yet</h3>
                <p className="text-gray-600 mb-6">Start by browsing available lockers</p>
                <Button 
                  onClick={() => window.location.href = '/lockers'}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Browse Lockers
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => {
                  const locker = typeof reservation.locker === 'object' ? reservation.locker : null;
                  const isCancelling = cancellingId === reservation._id;
                  return (
                    <div
                      key={reservation._id}
                      className="border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                              <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">
                                Locker #{locker?.number || 'N/A'}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                                {getPaymentStatusIcon(reservation.paymentStatus)}
                                <span className="ml-1 capitalize">{reservation.paymentStatus}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-8 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{reservation.duration} days</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>${reservation.totalPrice}</span>
                            </div>
                            {reservation.emailSent && (
                              <div className="flex items-center space-x-1 text-green-600">
                                <Mail className="h-4 w-4" />
                                <span>Email sent</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {/* Show cancel button for pending reservations */}
                          {reservation.paymentStatus === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelReservation(reservation._id)}
                                disabled={isCancelling}
                                loading={isCancelling}
                                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                              >
                                Pay Now
                              </Button>
                            </>
                          )}
                          
                          {/* Show cancel button for paid reservations (if cancellation is allowed) */}
                          {reservation.paymentStatus === 'paid' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelReservation(reservation._id)}
                              disabled={isCancelling}
                              loading={isCancelling}
                              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
