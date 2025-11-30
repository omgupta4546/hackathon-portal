import { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const InstructionModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAndFetchInstructions = async () => {
            const hasSeen = sessionStorage.getItem('hasSeenInstructions');
            if (!hasSeen) {
                try {
                    const { data } = await api.get('/instructions');
                    if (data && data.content) {
                        setInstructions(data.content);
                        setIsOpen(true);
                    }
                } catch (error) {
                    console.error('Failed to fetch instructions', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        checkAndFetchInstructions();
    }, []);

    const handleClose = () => {
        sessionStorage.setItem('hasSeenInstructions', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Info className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-white">General Instructions</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                <div className="prose prose-invert max-w-none">
                                    {instructions.split('\n').map((line, index) => (
                                        <p key={index} className="text-slate-300 mb-2 leading-relaxed">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                            <button
                                onClick={handleClose}
                                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary/20"
                            >
                                I Understand
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InstructionModal;
