import React, { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import LockerCard from '../components/Locker/LockerCard';
import ReservationModal from '../components/Locker/ReservationModal';

interface Locker {
    id: string;
    number: string;
    size: 'small' | 'medium' | 'large';
    status: 'available' | 'reserved' | 'maintenance';
    price: number;
    location?: string;
}

const LockerGrid: React.FC = () => {
    const [lockers, setLockers] = useState<Locker[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchLockers();
    }, []);

    const fetchLockers = async () => {
        try {
            const response = await fetch('/api/lockers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setLockers(data);
            } else {
                showNotification('Failed to load lockers', 'error');
            }
        } catch (error) {
            showNotification('Error loading lockers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLockerSelect = (locker: Locker) => {
        if (locker.status === 'available') {
            setSelectedLocker(locker);
            setIsModalOpen(true);
        }
    };

    const handleReservationSuccess = () => {
        setIsModalOpen(false);
        setSelectedLocker(null);
        fetchLockers(); // Refresh the lockers
        showNotification('Locker reserved successfully!', 'success');
    };

    const filteredLockers = lockers.filter(locker =>
        filter === 'all' || locker.size === filter
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'text-green-600';
            case 'reserved':
                return 'text-red-600';
            case 'maintenance':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Available Lockers</h1>
                <p className="text-gray-600 mb-6">
                    Select an available locker to make a reservation. Click on any green locker to get started.
                </p>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        All Sizes
                    </button>
                    <button
                        onClick={() => setFilter('small')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'small'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Small
                    </button>
                    <button
                        onClick={() => setFilter('medium')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'medium'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Medium
                    </button>
                    <button
                        onClick={() => setFilter('large')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'large'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Large
                    </button>
                </div>

                {/* Status Legend */}
                <div className="flex flex-wrap gap-6 mb-8 p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">Available</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">Reserved</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">Maintenance</span>
                    </div>
                </div>
            </div>

            {/* Lockers Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {filteredLockers.map((locker) => (
                    <LockerCard
                        key={locker.id}
                        locker={locker}
                        onClick={() => handleLockerSelect(locker)}
                    />
                ))}
            </div>

            {filteredLockers.length === 0 && (
                <div className="text-center py-12">
                    <svg
                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No lockers found</h3>
                    <p className="text-gray-500">
                        {filter === 'all'
                            ? 'No lockers are currently available.'
                            : `No ${filter} lockers are currently available.`}
                    </p>
                </div>
            )}

            {/* Reservation Modal */}
            {selectedLocker && (
                <ReservationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    locker={selectedLocker}
                    onSuccess={handleReservationSuccess}
                />
            )}
        </div>
    );
};

export default LockerGrid;