import React, { useState, useEffect } from 'react';
import { Phone, User } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Help = () => {
    const [coordinators, setCoordinators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const { data } = await api.get('/contacts');
                setCoordinators(data);
            } catch (err) {
                setError('Failed to load contact information');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                        Need Help?
                    </h1>
                    <p className="text-lg text-slate-300">
                        Contact the student coordinators for any queries.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {coordinators.map((coordinator) => (
                        <div key={coordinator._id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-primary/50 transition-colors">
                            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 mx-auto">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-white text-center mb-4">
                                {coordinator.name}
                            </h3>
                            <div className="flex items-center justify-center text-slate-300">
                                <Phone className="w-4 h-4 mr-2" />
                                <a href={`tel:${coordinator.phone}`} className="hover:text-primary transition-colors">
                                    {coordinator.phone}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Help;
