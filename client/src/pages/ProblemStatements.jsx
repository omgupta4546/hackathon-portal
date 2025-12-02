import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Filter, Lock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const ProblemStatements = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const { user } = useAuth();
    const [myTeam, setMyTeam] = useState(null);

    const [isRound1Active, setIsRound1Active] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [probsRes, teamRes, roundsRes] = await Promise.all([
                    api.get('/problems'),
                    user ? api.get('/teams/me').catch(() => ({ data: null })) : Promise.resolve({ data: null }),
                    api.get('/rounds')
                ]);
                setProblems(probsRes.data);
                setMyTeam(teamRes.data);

                // Check Round 1 status
                const round1 = roundsRes.data.find(r => r.roundId === 'round1');
                if (round1) {
                    const now = new Date();
                    const end = new Date(round1.endAt);
                    setIsRound1Active(now < end);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleSelect = async (problemId) => {
        if (!window.confirm('Are you sure? You cannot change this later.')) return;
        try {
            await api.post('/problems/select', { problemId });
            toast.success('Problem selected successfully!');
            // Refresh team data
            const { data } = await api.get('/teams/me');
            setMyTeam(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Selection failed');
        }
    };

    const filteredProblems = filter === 'All'
        ? problems
        : problems.filter(p => p.category === filter);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Problem Statements</h1>

                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select
                        className="input-field w-auto"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Software">Software</option>
                        <option value="Both">Both</option>
                    </select>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProblems.map((problem) => (
                    <div key={problem._id} className="card hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${problem.category === 'Hardware' ? 'bg-orange-100 text-orange-800' :
                                problem.category === 'Software' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                }`}>
                                {problem.category}
                            </span>

                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-2">{problem.title}</h3>
                        <p className="text-slate-300 text-sm mb-4 flex-grow">{problem.description}</p>

                        <div className="mt-4 pt-4 border-t border-slate-700">
                            {myTeam?.problemId?._id === problem._id ? (
                                <button disabled className="w-full py-2 bg-green-600 text-white rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Selected
                                </button>
                            ) : myTeam?.problemId ? (
                                <button disabled className="w-full py-2 bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed">
                                    Locked
                                </button>
                            ) : !isRound1Active ? (
                                <button disabled className="w-full py-2 bg-red-100 text-red-400 rounded-lg cursor-not-allowed flex items-center justify-center">
                                    <Lock className="w-4 h-4 mr-2" /> Selection Closed
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleSelect(problem._id)}
                                    disabled={!myTeam || myTeam.leaderUserId !== user?._id}
                                    className="w-full btn-primary disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    {!myTeam ? 'Create Team to Select' : myTeam.leaderUserId !== user?._id ? 'Leader Only' : 'Select Problem'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

import { CheckCircle } from 'lucide-react'; // Import missing icon

export default ProblemStatements;
