import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';

const Notification: React.FC = () => {
    const { notification, hideNotification } = useNotification();

    if (!notification.visible) return null;

    const getColorClasses = () => {
        switch (notification.type) {
            case 'success':
                return 'bg-green-50 text-green-800 border-green-200';
            case 'error':
                return 'bg-red-50 text-red-800 border-red-200';
            case 'info':
                return 'bg-blue-50 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-800 border-gray-200';
        }
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'info':
                return (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div className={`border rounded-lg p-4 shadow-lg ${getColorClasses()}`}>
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            onClick={hideNotification}
                            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;