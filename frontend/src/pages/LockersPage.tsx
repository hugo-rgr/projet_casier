import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Filter, Package, MapPin, Star, Clock, Shield } from 'lucide-react';
import { Locker } from '../types';

export const LockersPage: React.FC = () => {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [filteredLockers, setFilteredLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [reservationDuration, setReservationDuration] = useState(1);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadLockers();
  }, []);

  useEffect(() => {
    filterLockers();
  }, [lockers, searchTerm, sizeFilter, statusFilter]);

  const loadLockers = async () => {
    try {
      const data = await apiService.getAllLockers();
      console.log(data); // Debug log
      setLockers(data);
    } catch (error) {
      console.error('Failed to load lockers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLockers = () => {
    let filtered = lockers;

    if (searchTerm) {
      filtered = filtered.filter(locker =>
        locker.number.toString().includes(searchTerm)
      );
    }

    if (sizeFilter !== 'all') {
      filtered = filtered.filter(locker => locker.size === sizeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(locker => locker.status === statusFilter);
    }

    setFilteredLockers(filtered);
  };

  const handleReserve = async (locker: Locker) => {
    if (!user) {
      navigate('/login');
      return;
    }
    console.log('Selected locker:', locker); // Debug log
    setSelectedLocker(locker);
    setReservationError('');
  };

  const confirmReservation = async () => {
    if (!selectedLocker || !user) {
      console.error('Missing selectedLocker or user:', { selectedLocker, user });
      return;
    }

    console.log('Creating reservation with:', {
      lockerId: selectedLocker._id,
      duration: reservationDuration
    });

    setReservationLoading(true);
    setReservationError('');

    try {
      const result = await apiService.createReservation(selectedLocker._id, reservationDuration);
      console.log('Reservation created:', result);
      
      setSelectedLocker(null);
      setReservationDuration(1);
      // Reload lockers to update status
      await loadLockers();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Failed to create reservation:', error);
      setReservationError(error.message || 'Failed to create reservation. Please try again.');
    } finally {
      setReservationLoading(false);
    }
  };

  const getSizeIcon = (size: string) => {
    const iconProps = { className: "h-6 w-6" };
    return <Package {...iconProps} />;
  };

  const getSizeDetails = (size: string) => {
    switch (size) {
      case 'small': return { label: 'Small', description: 'Perfect for documents, small items', color: 'text-green-600' };
      case 'medium': return { label: 'Medium', description: 'Ideal for bags, electronics', color: 'text-blue-600' };
      case 'large': return { label: 'Large', description: 'Great for luggage, large items', color: 'text-purple-600' };
      default: return { label: size, description: '', color: 'text-gray-600' };
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading lockers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Browse Lockers
          </h1>
          <p className="text-xl text-gray-600">Find the perfect locker for your storage needs</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by locker number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600 font-medium">
            Showing <span className="text-blue-600 font-bold">{filteredLockers.length}</span> of <span className="font-bold">{lockers.length}</span> lockers
          </p>
        </div>

        {/* Lockers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLockers.map((locker) => {
            const sizeDetails = getSizeDetails(locker.size);
            return (
              <Card key={locker._id} hover className="group relative border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="pb-4 relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600`}>
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 text-lg">
                          #{locker.number}
                        </span>
                        <p className="text-sm text-gray-500">Locker</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(locker.status)}`}>
                      {locker.status}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="relative">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Size:</span>
                      <div className="text-right">
                        <span className={`text-sm font-semibold ${sizeDetails.color}`}>
                          {sizeDetails.label}
                        </span>
                        <p className="text-xs text-gray-500">{sizeDetails.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price:</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                          ${locker.price}
                        </span>
                        <p className="text-xs text-gray-500">/day</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      {locker.status === 'available' ? (
                        <Button
                          onClick={() => handleReserve(locker)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          size="sm"
                        >
                          Reserve Now
                        </Button>
                      ) : (
                        <Button
                          disabled
                          className="w-full"
                          size="sm"
                          variant="secondary"
                        >
                          {locker.status === 'reserved' ? 'Reserved' : 'Under Maintenance'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredLockers.length === 0 && (
          <div className="text-center py-16">
            <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No lockers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria to find available lockers</p>
          </div>
        )}

        {/* Reservation Modal */}
        {selectedLocker && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Reserve Locker #{selectedLocker.number}
              </h3>
              
              <div className="space-y-6">
                {reservationError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
                    {reservationError}
                  </div>
                )}

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Size:</span>
                    <span className="font-semibold capitalize">{selectedLocker.size}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price per day:</span>
                    <span className="font-bold text-green-600">${selectedLocker.price}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={reservationDuration}
                    onChange={(e) => setReservationDuration(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Cost:</span>
                    <span className="text-green-600">
                      ${(selectedLocker.price * reservationDuration).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedLocker(null);
                      setReservationError('');
                    }}
                    className="flex-1"
                    disabled={reservationLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmReservation}
                    loading={reservationLoading}
                    disabled={reservationLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Confirm Reservation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
