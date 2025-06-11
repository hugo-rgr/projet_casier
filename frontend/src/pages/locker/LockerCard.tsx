import React from 'react';

interface Locker {
    id: string;
    number: string;
    size: 'small' | 'medium' | 'large';
    status: 'available' | 'reserved' | 'maintenance';
    price: number;
    location?: string;
}

interface LockerCardProps {
    locker: Locker;
    onClick: () => void;
}

const LockerCard: React.FC<LockerCardProps> = ({ locker, onClick }) => {
    const getStatusColor = () => {
        switch (locker.status) {
            case 'available':
                return 'bg-green-500 hover:bg-green-600';
            case 'reserved':
                return 'bg-red-500';
            case 'maintenance':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getSizeIcon = () => {
        switch (locker.size) {
            case 'small':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                );
            case 'medium':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                );
            case 'large':
                return (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const isClickable = locker.status === 'available';

    return (
        <div
            onClick={isClickable ? onClick : undefined}
            className={`
        relative aspect-square rounded-lg border-2 border-white shadow-lg transition-all duration-200
        ${getStatusColor()}
        ${isClickable ? 'cursor-pointer transform hover:scale-105' : 'cursor-not-allowed opacity-75'}
        flex flex-col items-center justify-center text-white p-2
      `}
        >
            {/* Locker Icon */}
            <div className="mb-1">
                {getSizeIcon()}
            </div>

            {/* Locker Number */}
            <div className="font-bold text-sm md:text-base">
                #{locker.number}
            </div>

            {/* Size Badge */}
            <div className="absolute top-1 right-1 bg-black bg-opacity-30 rounded px-1 py-0.5 text-xs font-medium">
                {locker.size.charAt(0).toUpperCase()}
            </div>

            {/* Price */}
            <div className="text-xs mt-1 font-medium">
                €{locker.price}/day
            </div>

            {/* Status Indicator */}
            {locker.status !== 'available' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <span className="text-white text-xs font-bold uppercase tracking-wide">
            {locker.status}
          </span>
                </div>
            )}

            {/* Lock Icon for Reserved/Maintenance */}
            {locker.status !== 'available' && (
                <div className="absolute top-2 left-2">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default LockerCard;