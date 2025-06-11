import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center py-16">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">
                    Reserve Your Locker Today
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    Secure, convenient, and automated locker reservations.
                    Choose your duration, make your reservation, and get instant confirmation.
                </p>
                {!user ? (
                    <div className="space-x-4">
                        <Link
                            to="/register"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                ) : (
                    <Link
                        to="/lockers"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                        View Available Lockers
                    </Link>
                )}
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 py-16">
                <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Storage</h3>
                    <p className="text-gray-600">
                        Your belongings are safe with our secure locker system.
                        Each locker is individually locked and monitored.
                    </p>
                </div>

                <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Flexible Duration</h3>
                    <p className="text-gray-600">
                        Choose from hourly, daily, or weekly reservations.
                        Automatic expiration and renewal reminders included.
                    </p>
                </div>

                <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Notifications</h3>
                    <p className="text-gray-600">
                        Get instant confirmation emails and reminders before your
                        reservation expires. Never lose track of your locker.
                    </p>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-gray-100 rounded-xl p-8 my-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    How It Works
                </h2>
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                            1
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Choose a Locker</h4>
                        <p className="text-gray-600 text-sm">
                            Browse available lockers and select the size that fits your needs.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                            2
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Set Duration</h4>
                        <p className="text-gray-600 text-sm">
                            Select how long you need the locker - from hours to weeks.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                            3
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Make Payment</h4>
                        <p className="text-gray-600 text-sm">
                            Complete your reservation with secure online payment.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                            4
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Get Confirmation</h4>
                        <p className="text-gray-600 text-sm">
                            Receive your locker number and access code via email.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!user && (
                <div className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white my-16">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of satisfied customers who trust us with their storage needs.
                    </p>
                    <Link
                        to="/register"
                        className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Create Your Account
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;