import React, { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';

interface Locker {
    id: string;
    number: string;
    size: 'small' | 'medium' | 'large';
    status: 'available' | 'reserved' | 'maintenance';
    price: number;
    location?: string;
}

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    locker: Locker;
    onSuccess: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               locker,
                                                               onSuccess,
                                                           }) => {
    const [duration, setDuration] = useState('1');
    const [durationType, setDurationType] = useState<'hours' | 'days' | 'weeks'>('days');
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    if (!isOpen) return null;

    const calculatePrice = () => {
        const basePrice = locker.price;
        const durationNum = parseInt(duration);

        switch (durationType) {
            case 'hours':
                return (basePrice / 24) * durationNum;
            case 'days':
                return basePrice * durationNum;
            case 'weeks':
                return basePrice * 7 * durationNum;
            default:
                return basePrice;
        }
    };

    const calculateEndDate = () => {
        const now = new Date();
        const durationNum = parseInt(duration);

        switch (durationType) {
            case 'hours':
                now.setHours(now.getHours() + durationNum);
                break;
            case 'days':
                now.setDate(now.getDate() + durationNum);
                break;
            case 'weeks':
                now.setDate(now.getDate() + (durationNum * 7));
                break;
        }

        return now.toLocaleString();
    };

    const handleReservation = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    lockerId: locker.id,
                    duration: parseInt(duration),
                    durationType,
                    totalPrice: calculatePrice(),
                }),
            });

            if (response.ok) {
                onSuccess();
                showNotification('Locker reserved successfully! Check your email for confirmation.', 'success');
            } else {
                const error = await response.json();
                showNotification(error.message || 'Failed to reserve locker', 'error');
            }
        } catch (error) {
            showNotification('Error creating reservation', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Reserve Locker</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Locker Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Locker Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Number:</span>
                                <span className="ml-2 font-medium">#{locker.number}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Size:</span>
                                <span className="ml-2 font-medium capitalize">{locker.size}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Base Price:</span>
                                <span className="ml-2 font-medium">€{locker.price}/day</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Status:</span>
                                <span className="ml-2 font-medium text-green-600">Available</span>
                            </div>
                        </div>
                    </div>

                    {/* Duration Selection */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Reservation Duration</h3>

                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration
                                </label>
                                <input
                                    type="number"
                                    id="duration"
                                    min="1"
                                    max="52"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex-1">
                                <label htmlFor="durationType" className="block text-sm font-medium text-gray-700 mb-1">
                                    Period
                                </label>
                                <select
                                    id="durationType"
                                    value={durationType}
                                    onChange={(e) => setDurationType(e.target.value as 'hours' | 'days' | 'weeks')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="hours">Hours</option>
                                    <option value="days">Days</option>
                                    <option value="weeks">Weeks</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600">
                            <p>Reservation will end on: <span className="font-medium">{calculateEndDate()}</span></p>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Price Summary</h3>
                        <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {duration} {durationType} × €{locker.price}{durationType === 'hours' ? '/day' : durationType === 'days' ? '/day' : '/week'}
              </span>
                            <span className="text-2xl font-bold text-blue-600">
                €{calculatePrice().toFixed(2)}
              </span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
                        <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                            <div className="flex items-center">
                                <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-800">Stripe Payment</p>
                                    <p className="text-sm text-gray-600">Secure online payment (Demo mode)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="mb-6">
                        <label className="flex items-start">
                            <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                required
                            />
                            <span className="ml-2 text-sm text-gray-600">
                I agree to the terms and conditions. I understand that this locker will be automatically released after the reservation period expires.
              </span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReservation}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </div>
                            ) : (
                                `Reserve for €${calculatePrice().toFixed(2)}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;