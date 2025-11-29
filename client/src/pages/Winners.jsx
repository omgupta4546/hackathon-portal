import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Winners = () => {
    const [winners, setWinners] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Admin state
    const [selectedTeam, setSelectedTeam] = useState('');
    const [rank, setRank] = useState(1);

    useEffect(() => {
        fetchWinners();
        if (user?.role === 'admin') {
            fetchTeams();
        }
    }, [user]);

    const fetchWinners = async () => {
        try {
            const { data } = await api.get('/admin/winners');
            setWinners(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeams = async () => {
        try {
            const { data } = await api.get('/admin/teams');
            setTeams(data);
        } catch (error) {
            console.error(error);
        }
    }

    const declareWinner = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/winners', { teamId: selectedTeam, rank });
            toast.success('Winner declared!');
            fetchWinners();
        } catch (error) {
            toast.error('Failed to set winner');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading winners...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-extrabold text-yellow-500 mb-8 text-center"            >
                🏆 Hackathon Champions
            </motion.h1>

            {/* Admin Controls */}
            {user?.role === 'admin' && (
                <div className="card mb-12 border-2 border-primary/20">
                    <h2 className="text-xl font-bold mb-4">Admin: Declare Winners</h2>
                    <form onSubmit={declareWinner} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-grow w-full">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Select Team</label>
                            <select
                                className="input-field"
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                                required
                            >
                                <option value="">-- Select Team --</option>
                                {teams.map(t => (
                                    <option key={t._id} value={t._id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Rank</label>
                            <select
                                className="input-field"
                                value={rank}
                                onChange={(e) => setRank(e.target.value)}
                            >
                                <option value="1">1st Place</option>
                                <option value="2">2nd Place</option>
                                <option value="3">3rd Place</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary w-full md:w-auto">Publish Winner</button>
                    </form>
                </div>
            )}

            {/* Winners Display */}
            {winners.length === 0 ? (
                <div className="text-center py-12">
                    <Trophy className="w-24 h-24 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-500">Winners to be announced soon!</h3>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8 items-end">
                    {/* Logic to display 2nd, 1st, 3rd in podium style order if possible, or just list */}
                    {winners.map((winner, index) => (
                        <motion.div
                            key={winner._id}
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.2, type: 'spring' }}
                            className={`card relative overflow-hidden ${winner.winningRank === 1 ? 'border-yellow-400 shadow-xl scale-105 z-10 order-first md:order-2' :
                                winner.winningRank === 2 ? 'border-slate-300 order-2 md:order-1' :
                                    'border-orange-300 order-3'
                                }`}>
                            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                                <Trophy className="w-32 h-32" />
                            </div>

                            <div className="text-center mb-6">
                                {winner.winningRank === 1 && <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2" />}
                                {winner.winningRank === 2 && <Medal className="w-12 h-12 text-slate-400 mx-auto mb-2" />}
                                {winner.winningRank === 3 && <Award className="w-12 h-12 text-orange-500 mx-auto mb-2" />}

                                <h2 className="text-2xl font-bold text-slate-900">{winner.name}</h2>
                                <p className="text-primary font-medium mt-1">
                                    {winner.winningRank === 1 ? '1st Place' : winner.winningRank === 2 ? '2nd Place' : '3rd Place'}
                                </p>
                            </div>

                            <div className="space-y-2 text-sm text-slate-600">
                                <p><span className="font-semibold">Problem:</span> {winner.problemId?.title}</p>
                                <p><span className="font-semibold">Category:</span> {winner.problemId?.category}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Winners;
