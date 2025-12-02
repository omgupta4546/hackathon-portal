import { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import { Info as InfoIcon } from 'lucide-react';

const Info = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const { data } = await api.get('/instructions');
                if (data && data.content) {
                    setContent(data.content);
                }
            } catch (error) {
                console.error('Failed to fetch info', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
            >
                <div className="flex items-center mb-6 border-b border-slate-700 pb-4">
                    <InfoIcon className="w-8 h-8 text-primary mr-3" />
                    <h1 className="text-3xl font-bold text-white">General Information</h1>
                </div>

                <div className="prose prose-invert max-w-none">
                    {content.split('\n').map((line, index) => (
                        <p key={index} className={`text-slate-300 leading-relaxed ${line.trim() === '' ? 'h-4' : 'mb-2'}`}>
                            {line}
                        </p>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Info;
