import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, XCircle, Calendar, Lock, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

const Rounds = () => {
    const [rounds, setRounds] = useState([]);
    const [myTeam, setMyTeam] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roundsRes, teamRes] = await Promise.all([
                    api.get('/rounds'),
                    user ? api.get('/teams/me').catch(() => ({ data: null })) : Promise.resolve({ data: null })
                ]);
                setRounds(roundsRes.data.sort((a, b) => a.roundId.localeCompare(b.roundId)));
                setMyTeam(teamRes.data);

                if (teamRes.data) {
                    const subRes = await api.get('/submissions');
                    setSubmissions(subRes.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const getRoundStatus = (roundId) => {
        if (!myTeam) return { state: 'locked', label: 'Locked', color: 'border-l-slate-300' };
        const now = new Date();

        if (roundId === 'round1') {
            if (myTeam.problemId) {
                return { state: 'selected', label: 'Problem Selected', color: 'border-l-green-500' };
            }
            const round = rounds.find(r => r.roundId === 'round1');
            if (round && now > new Date(round.endAt)) {
                return { state: 'locked', label: 'Selection Closed', color: 'border-l-red-500' };
            }
            return { state: 'open', label: 'Select Problem', color: 'border-l-blue-500' };
        }

        if (roundId === 'round2') {
            if (!myTeam.problemId) return { state: 'locked', label: 'Locked', color: 'border-l-slate-300' };

            const round = rounds.find(r => r.roundId === 'round2');
            if (!round) return { state: 'locked', label: 'Locked', color: 'border-l-slate-300' };

            if (now < new Date(round.startAt)) return { state: 'locked', label: 'Starts Soon', color: 'border-l-slate-300' };
            // Allow viewing status even if ended, but maybe lock submission? For now, just check submission.

            const sub = submissions.find(s => s.roundId === 'round2');
            if (sub) {
                if (sub.status === 'shortlisted') return { state: 'qualified', label: 'Shortlisted', color: 'border-l-green-500' };
                if (sub.status === 'rejected') return { state: 'rejected', label: 'Rejected', color: 'border-l-red-500' };
                return { state: 'submitted', label: 'Submitted', color: 'border-l-yellow-500' };
            }

            if (now > new Date(round.endAt)) return { state: 'locked', label: 'Ended', color: 'border-l-red-500' };

            return { state: 'open', label: 'Submit Idea', color: 'border-l-blue-500' };
        }

        if (roundId === 'round3') {
            if (myTeam.winningRank && myTeam.winningRank > 0) {
                return { state: 'winner', label: `Winner (Rank ${myTeam.winningRank})`, color: 'border-l-yellow-400' };
            }

            const r2Sub = submissions.find(s => s.roundId === 'round2');
            if (r2Sub && r2Sub.status === 'shortlisted') {
                return { state: 'qualified', label: 'Grand Finale', color: 'border-l-blue-500' };
            }

            return { state: 'locked', label: 'Locked', color: 'border-l-slate-300' };
        }
        return { state: 'locked', label: 'Locked', color: 'border-l-slate-300' };
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white mb-8"
            >
                Phases & Schedule
            </motion.h1>

            <div className="space-y-6">
                {rounds.map((round, index) => {
                    const status = getRoundStatus(round.roundId);

                    return (
                        <motion.div
                            key={round._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`card border-l-4 ${status.color}`}
                        >
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-bold text-slate-100 flex items-center flex-wrap gap-2">
                                        {round.name}
                                        <span className={`px-3 py-1 text-xs rounded-full flex items-center font-medium shrink-0 ${status.state === 'winner' ? 'bg-yellow-100 text-yellow-800' :
                                            status.state === 'shortlisted' || status.state === 'qualified' || status.state === 'selected' ? 'bg-green-100 text-green-800' :
                                                status.state === 'submitted' ? 'bg-yellow-50 text-yellow-700' :
                                                    status.state === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-slate-100 text-slate-600'
                                            }`}>
                                            {status.state === 'winner' && <Trophy className="w-3 h-3 mr-1" />}
                                            {(status.state === 'shortlisted' || status.state === 'selected') && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {status.label}
                                        </span>
                                    </h2>
                                    <p className="text-slate-300 mt-2 text-sm md:text-base leading-relaxed">{round.description}</p>
                                    <div className="flex items-center text-sm text-slate-400 mt-3">
                                        <Calendar className="w-4 h-4 mr-1 shrink-0" />
                                        {round.startAt ? new Date(round.startAt).toLocaleDateString('en-GB') : 'TBA'}
                                        {round.endAt ? ` - ${new Date(round.endAt).toLocaleDateString('en-GB')}` : ''}
                                        {round.isOffline && <span className="ml-4 px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs shrink-0">Offline Mode</span>}
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-0 md:ml-6 shrink-0 flex flex-col items-start md:items-end">
                                    {status.state === 'open' && (
                                        round.roundId === 'round1' ? (
                                            <Link to="/problems" className="btn-primary">Select Problem</Link>
                                        ) : (
                                            <Link to={`/submit/${round.roundId}`} className="btn-primary">Submit Idea</Link>
                                        )
                                    )}
                                    {(status.state === 'submitted' || status.state === 'selected') && (
                                        <span className="text-green-600 font-medium flex items-center">
                                            <CheckCircle className="w-5 h-5 mr-1" />
                                            {status.state === 'selected' ? 'Selected' : 'Submitted'}
                                        </span>
                                    )}
                                    {status.state === 'locked' && (
                                        <span className="text-slate-400 text-sm italic flex items-center"><Lock className="w-4 h-4 mr-1" /> Locked</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Rounds;
