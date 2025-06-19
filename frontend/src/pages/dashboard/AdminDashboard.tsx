import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Package, Users, DollarSign, Settings, Plus, Edit, Trash2, CreditCard, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Locker, Reservation } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'lockers' | 'reservations'>('overview');
  const [showCreateLocker, setShowCreateLocker] = useState(false);
  const [editingLocker, setEditingLocker] = useState<Locker | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lockersData, reservationsData] = await Promise.all([
        apiService.getAllLockers(),
        apiService.getAllReservations(),
      ]);
      setLockers(lockersData);
      setReservations(reservationsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLocker = async (formData: FormData) => {
    try {
      await apiService.createLocker({
        number: parseInt(formData.get('number') as string),
        size: formData.get('size') as string,
        status: formData.get('status') as string,
        price: parseFloat(formData.get('price') as string),
      });
      setShowCreateLocker(false);
      loadData();
    } catch (error) {
      console.error('Failed to create locker:', error);
    }
  };

  const handleUpdateLocker = async (id: string, formData: FormData) => {
    try {
      await apiService.updateLocker(id, {
        number: parseInt(formData.get('number') as string),
        size: formData.get('size') as string,
        status: formData.get('status') as string,
        price: parseFloat(formData.get('price') as string),
      });
      setEditingLocker(null);
      loadData();
    } catch (error) {
      console.error('Failed to update locker:', error);
    }
  };

  const handleDeleteLocker = async (id: string) => {
    if (!confirm('Are you sure you want to delete this locker?')) return;
    
    try {
      await apiService.deleteLocker(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete locker:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'reserved': return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
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

  const availableLockers = lockers.filter(l => l.status === 'available').length;
  const reservedLockers = lockers.filter(l => l.status === 'reserved').length;
  const paidReservations = reservations.filter(r => r.paymentStatus === 'paid').length;
  const totalRevenue = reservations.filter(r => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.totalPrice, 0);
  const pendingPayments = reservations.filter(r => r.paymentStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">Manage lockers, reservations, and system settings</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'lockers', label: 'Lockers' },
              { key: 'reservations', label: 'Reservations' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Available</p>
                      <p className="text-3xl font-bold">{availableLockers}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Package className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">Reserved</p>
                      <p className="text-3xl font-bold">{reservedLockers}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Package className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Paid Reservations</p>
                      <p className="text-3xl font-bold">{paidReservations}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Users className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Revenue</p>
                      <p className="text-3xl font-bold">${totalRevenue.toFixed(0)}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                      <DollarSign className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm font-medium">Pending</p>
                      <p className="text-3xl font-bold">{pendingPayments}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                      <CreditCard className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Recent Reservations</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {reservations.slice(0, 5).map((reservation) => {
                    const locker = typeof reservation.locker === 'object' ? reservation.locker : null;
                    const user = typeof reservation.user === 'object' ? reservation.user : null;
                    return (
                      <div key={reservation._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Locker #{locker?.number || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user?.firstname} {user?.lastname}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                            {getPaymentStatusIcon(reservation.paymentStatus)}
                            <span className="ml-1 capitalize">{reservation.paymentStatus}</span>
                          </span>
                          <p className="text-sm font-semibold text-gray-900">${reservation.totalPrice}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lockers Tab */}
        {activeTab === 'lockers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Lockers</h2>
              <Button 
                onClick={() => setShowCreateLocker(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Locker
              </Button>
            </div>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Number
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lockers.map((locker) => (
                        <tr key={locker._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            #{locker.number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {locker.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(locker.status)}`}>
                              {locker.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            ${locker.price}/day
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingLocker(locker)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLocker(locker._id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">All Reservations</h2>
            
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Locker
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Payment Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Email Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservations.map((reservation) => {
                        const locker = typeof reservation.locker === 'object' ? reservation.locker : null;
                        const user = typeof reservation.user === 'object' ? reservation.user : null;
                        return (
                          <tr key={reservation._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              #{locker?.number || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user?.firstname} {user?.lastname}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {reservation.duration} days
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                                {getPaymentStatusIcon(reservation.paymentStatus)}
                                <span className="ml-1 capitalize">{reservation.paymentStatus}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              ${reservation.totalPrice}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                {reservation.emailSent && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Sent
                                  </span>
                                )}
                                {reservation.reminderSent && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Reminder
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create/Edit Locker Modal */}
        {(showCreateLocker || editingLocker) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {editingLocker ? 'Edit Locker' : 'Create New Locker'}
              </h3>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  if (editingLocker) {
                    handleUpdateLocker(editingLocker._id, formData);
                  } else {
                    handleCreateLocker(formData);
                  }
                }}
                className="space-y-6"
              >
                <Input
                  name="number"
                  label="Locker Number"
                  type="number"
                  defaultValue={editingLocker?.number || ''}
                  required
                  className="h-12"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <select
                    name="size"
                    defaultValue={editingLocker?.size || 'small'}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingLocker?.status || 'available'}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <Input
                  name="price"
                  label="Price per Day ($)"
                  type="number"
                  step="0.01"
                  defaultValue={editingLocker?.price || ''}
                  required
                  className="h-12"
                />

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateLocker(false);
                      setEditingLocker(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {editingLocker ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
