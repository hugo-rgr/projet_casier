import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
    showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
    notification: {
        message: string;
        type: 'success' | 'error' | 'info';
        visible: boolean;
    };
    hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notification, setNotification] = useState({
        message: '',
        type: 'info' as const,
        visible: false,
    });

    const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setNotification({
            message,
            type,
            visible: true,
        });

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification();
        }, 5000);
    };

    const hideNotification = () => {
        setNotification(prev => ({
            ...prev,
            visible: false,
        }));
    };

    const value = {
        showNotification,
        notification,
        hideNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};