import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Users, Code, CheckCircle, Clock, AlertCircle, Lock, FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const { user } = useAuth();
    const [team, setTeam] = useState(null);
    const [rounds, setRounds] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [teamName, setTeamName] = useState('');
    const [inviteCode, setInviteCode] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [teamRes, roundsRes, subsRes] = await Promise.allSettled([
                api.get('/teams/me'),
                api.get('/rounds'),
                api.get('/submissions')
            ]);

            if (teamRes.status === 'fulfilled') setTeam(teamRes.value.data);
            if (roundsRes.status === 'fulfilled') setRounds(roundsRes.value.data);
            if (subsRes.status === 'fulfilled') setSubmissions(subsRes.value.data);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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

    if (loading) return <LoadingSpinner />;

    // Helper to check round status
    const getRoundStatus = (roundId) => {
        const round = rounds.find(r => r.roundId === roundId);
        if (!round) return 'unknown';
        const now = new Date();
        const start = new Date(round.startAt);
        const end = round.endAt ? new Date(round.endAt) : null;

        if (now < start) return 'upcoming';
        if (end && now > end) return 'ended';
        return 'active';
    };

    const isRejected = submissions.some(s => s.status === 'rejected');
    const round1 = rounds.find(r => r.roundId === 'round1');
    const isRound1Active = round1 && new Date() < new Date(round1.endAt); // Active if before end date

    const round2 = rounds.find(r => r.roundId === 'round2');
    const isRound2Active = round2 && new Date() >= new Date(round2.startAt) && new Date() <= new Date(round2.endAt);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Welcome, {user.name}</h1>

            {isRejected && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-8 flex items-center">
                    <AlertCircle className="w-6 h-6 mr-3" />
                    <div>
                        <h3 className="font-bold text-lg">Team Rejected</h3>
                        <p>Unfortunately, your team has been rejected. You cannot participate in further rounds.</p>
                    </div>
                </div>
            )}

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
                            {!isRejected && (
                                <button onClick={leaveTeam} className="text-red-500 text-sm hover:underline">Leave Team</button>
                            )}
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

                    {/* Problem Statement Status - Round 1 */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center"><Code className="mr-2 text-primary" /> Problem Statement</h2>
                        {team.problemId ? (
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-blue-900">{team.problemId.title}</h3>
                                        <p className="text-blue-700 text-sm mt-1">{team.problemId.category} • {team.problemId.difficulty}</p>
                                        <p className="text-slate-600 mt-2">{team.problemId.description}</p>
                                    </div>
                                    {isRound1Active && !isRejected && team.leaderUserId === user._id && (
                                        <Link to="/problems" className="text-sm text-blue-600 hover:underline flex items-center">
                                            <Code className="w-4 h-4 mr-1" /> Change
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                {isRejected ? (
                                    <p className="text-red-500 mb-4">Selection Locked (Team Rejected)</p>
                                ) : isRound1Active ? (
                                    <>
                                        <p className="text-black mb-4">You haven't selected a problem statement yet.</p>
                                        {team.leaderUserId === user._id ? (
                                            <Link to="/problems" className="btn-primary">Browse Problems</Link>
                                        ) : (
                                            <p className="text-sm text-slate-300">Only the team leader can select a problem.</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-red-500 mb-4 flex items-center justify-center">
                                        <Lock className="w-4 h-4 mr-2" /> Problem Selection Locked (Phase 1 Ended)
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Submission Status - Round 2 */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center"><CheckCircle className="mr-2 text-green-600" /> Submission Status</h2>
                        {isRejected ? (
                            <div className="bg-slate-50 p-4 rounded-lg text-center text-slate-500">
                                <p>Submissions are closed for rejected teams.</p>
                            </div>
                        ) : isRound2Active ? (
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-black font-medium">Phase 2: Idea Submission</p>
                                    <p className="text-sm text-red-500">Deadline: {new Date(round2?.endAt).toLocaleDateString()}</p>
                                </div>
                                <Link to="/submit/round2" className="btn-secondary text-sm">View / Submit</Link>
                            </div>
                        ) : (
                            <div className="bg-slate-50 p-4 rounded-lg text-center text-slate-500">
                                <p className="flex items-center justify-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {getRoundStatus('round2') === 'upcoming' ? 'Phase 2 (Idea Submission) has not started yet.' : 'Phase 2 has ended.'}
                                </p>
                            </div>
                        )}
                    </div>


                    {/* Resources */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center text-blue-400">
                            <FileText className="w-6 h-6 mr-2" />
                            Resources
                        </h2>
                        <div className="bg-slate-700/50 border border-slate-600 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-100">Round 2 PPT Template</h3>
                                <p className="text-slate-400 text-sm">Use this template for your idea submission.</p>
                            </div>
                            <a
                                href="https://docs.google.com/presentation/d/1ok4wQVbIPjNhmngpncWqOfxZNyUNphfF/edit?usp=sharing&ouid=115438521212361487487&rtpof=true&sd=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center whitespace-nowrap"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Template
                            </a>
                        </div>
                    </div>

                    {/* WhatsApp Group Link */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center text-green-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                            >
                                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                            </svg>
                            Join WhatsApp Group
                        </h2>
                        <div className="bg-green-50 border border-green-100 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-lg text-green-900">Stay Updated!</h3>
                                <p className="text-green-700 text-sm">Join the official hackathon WhatsApp group for announcements and queries.</p>
                            </div>
                            <a
                                href="https://chat.whatsapp.com/HwYEBtwkwMu0s4dkZfuKvj"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                            >
                                Join Group
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
