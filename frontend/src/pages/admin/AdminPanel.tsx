import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';

interface Locker {
    id: string;
    number: string;
    size: 'small' | 'medium' | 'large';
    status: 'available' | 'reserved' | 'maintenance';
    price: number;
    location?: string;
}

const AdminPanel: React.FC = () => {
    const [lockers, setLockers] = useState<Locker[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingLocker, setEditingLocker] = useState<Locker | null>(null);
    const { showNotification } = useNotification();

    const [newLocker, setNewLocker] = useState({
        number: '',
        size: 'small' as const,
        price: 10,
        location: '',
    });

    useEffect(() => {
        fetchLockers();
    }, []);

    const fetchLockers = async () => {
        try {
            const response = await fetch('/api/admin/lockers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setLockers(data);
            }
        } catch (error) {
            showNotification('Error loading lockers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddLocker = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/admin/lockers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newLocker),
            });

            if (response.ok) {
                showNotification('Locker added successfully!', 'success');
                setShowAddModal(false);
                setNewLocker({ number: '', size: 'small', price: 10, location: '' });
                fetchLockers();
            } else {
                showNotification('Failed to add locker', 'error');
            }
        } catch (error) {
            showNotification('Error adding locker', 'error');
        }
    };

    const handleDeleteLocker = async (lockerId: string) => {
        if (!confirm('Are you sure you want to delete this locker?')) return;

        try {
            const response = await fetch(`/api/admin/lockers/${lockerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                showNotification('Locker deleted successfully!', 'success');
                fetchLockers();
            } else {
                showNotification('Failed to delete locker', 'error');
            }
        } catch (error) {
            showNotification('Error deleting locker', 'error');
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Add New Locker
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800">Total Lockers</h3>
                    <p className="text-3xl font-bold text-blue-600">{lockers.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800">Available</h3>
                    <p className="text-3xl font-bold text-green-600">
                        {lockers.filter(l => l.status === 'available').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800">Reserved</h3>
                    <p className="text-3xl font-bold text-red-600">
                        {lockers.filter(l => l.status === 'reserved').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800">Maintenance</h3>
                    <p className="text-3xl font-bold text-yellow-600">
                        {lockers.filter(l => l.status === 'maintenance').length}
                    </p>
                </div>
            </div>

            {/* Lockers Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Manage Lockers</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {lockers.map((locker) => (
                            <tr key={locker.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">#{locker.number}</td>
                                <td className="px-6 py-4 whitespace-nowrap capitalize">{locker.size}</td>
                                <td className="px-6 py-4 whitespace-nowrap">€{locker.price}/day</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        locker.status === 'available' ? 'bg-green-100 text-green-800' :
                            locker.status === 'reserved' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                    }`}>
                      {locker.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{locker.location || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => setEditingLocker(locker)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLocker(locker.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Locker Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Locker</h2>
                        <form onSubmit={handleAddLocker} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Locker Number</label>
                                <input
                                    type="text"
                                    value={newLocker.number}
                                    onChange={(e) => setNewLocker({...newLocker, number: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                                <select
                                    value={newLocker.size}
                                    onChange={(e) => setNewLocker({...newLocker, size: e.target.value as 'small' | 'medium' | 'large'})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Day (€)</label>
                                <input
                                    type="number"
                                    value={newLocker.price}
                                    onChange={(e) => setNewLocker({...newLocker, price: Number(e.target.value)})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                                <input
                                    type="text"
                                    value={newLocker.location}
                                    onChange={(e) => setNewLocker({...newLocker, location: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Building A, Floor 1"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                                >
                                    Add Locker
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;