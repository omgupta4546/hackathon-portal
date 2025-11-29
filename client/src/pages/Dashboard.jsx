import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Users, Code, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [teamName, setTeamName] = useState('');
    const [inviteCode, setInviteCode] = useState('');

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const { data } = await api.get('/teams/me');
            setTeam(data);
        } catch (error) {
            // No team found is expected for new users
        } finally {
            setLoading(false);
        }
    };

    const createTeam = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/teams', { name: teamName });
            setTeam(data);
            toast.success('Team created!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create team');
        }
    };

    const joinTeam = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/teams/join', { inviteCode });
            setTeam(data);
            toast.success('Joined team successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to join team');
        }
    };

    const leaveTeam = async () => {
        if (!window.confirm('Are you sure you want to leave?')) return;
        try {
            await api.put('/teams/leave');
            setTeam(null);
            toast.success('Left team');
        } catch (error) {
            toast.error('Failed to leave team');
        }
    }

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Welcome, {user.name}</h1>

            {!team ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Create Team */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center"><Users className="mr-2 text-primary" /> Create a Team</h2>
                        <p className="text-slate-300 mb-4">Start a new team and invite your friends.</p>
                        <form onSubmit={createTeam} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Team Name"
                                className="input-field"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn-primary w-full">Create Team</button>
                        </form>
                    </div>

                    {/* Join Team */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center"><Users className="mr-2 text-accent" /> Join a Team</h2>
                        <p className="text-slate-300 mb-4">Enter an invite code to join an existing team.</p>
                        <form onSubmit={joinTeam} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Invite Code"
                                className="input-field"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn-secondary w-full">Join Team</button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Team Info */}
                    <div className="card">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-100 mb-2">{team.name}</h2>
                                <p className="text-slate-300 flex items-center">
                                    <span className="font-mono bg-slate-700 px-2 py-1 rounded text-sm mr-2">Code: {team.inviteCode}</span>
                                    (Share this code to invite members)
                                </p>
                            </div>
                            <button onClick={leaveTeam} className="text-red-500 text-sm hover:underline">Leave Team</button>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-3">Team Members</h3>
                            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {team.members.map((member) => (
                                    <div key={member.userId} className="bg-slate-700 p-3 rounded-lg border border-slate-600 flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-3">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-slate-100">{member.name}</p>
                                            <p className="text-xs text-slate-400">{member.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Problem Statement Status */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center"><Code className="mr-2 text-primary" /> Problem Statement</h2>
                        {team.problemId ? (
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                                <h3 className="font-bold text-lg text-blue-900">{team.problemId.title}</h3>
                                <p className="text-blue-700 text-sm mt-1">{team.problemId.category} • {team.problemId.difficulty}</p>
                                <p className="text-slate-300 mt-2">{team.problemId.description}</p>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                <p className="text-black mb-4">You haven't selected a problem statement yet.</p>
                                {team.leaderUserId === user._id ? (
                                    <Link to="/problems" className="btn-primary">Browse Problems</Link>
                                ) : (
                                    <p className="text-sm text-slate-300">Only the team leader can select a problem.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Submission Status */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center"><CheckCircle className="mr-2 text-green-600" /> Submission Status</h2>
                        {/* This would ideally fetch submission status from API */}
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                            <div>
                                <p className="text-black font-medium">Round 1: Idea Submission</p>
                                <p className="text-sm text-red-500">Deadline: Nov 30, 2025</p>
                            </div>
                            <Link to="/submit/round1" className="btn-secondary text-sm">View / Submit</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
