import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Send, Loader, Users, Trash2, History } from 'lucide-react';
import { format } from 'date-fns';

const AdminNotificationPanel = () => {
    const [message, setMessage] = useState('');
    const [recipientType, setRecipientType] = useState('all'); // 'all', 'team', 'specific'
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [broadcasts, setBroadcasts] = useState([]);

    // Fetch teams when needed
    useEffect(() => {
        if (recipientType === 'team' && teams.length === 0) {
            fetchTeams();
        }
    }, [recipientType]);

    // Fetch broadcasts on mount
    useEffect(() => {
        fetchBroadcasts();
    }, []);

    const fetchTeams = async () => {
        try {
            const { data } = await api.get('/admin/teams');
            setTeams(data);
        } catch (error) {
            console.error("Failed to fetch teams", error);
        }
    };

    const fetchBroadcasts = async () => {
        try {
            const { data } = await api.get('/notifications/broadcasts');
            setBroadcasts(data);
        } catch (error) {
            console.error("Failed to fetch broadcasts", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const payload = {
                message,
                sendToAll: recipientType === 'all',
                sendToTeam: recipientType === 'team',
                teamId: recipientType === 'team' ? selectedTeam : undefined,
                type: 'info'
            };

            await api.post('/notifications/send', payload);

            setStatus({ type: 'success', msg: 'Notification sent successfully!' });
            setMessage('');
            fetchBroadcasts(); // Refresh history
        } catch (error) {
            setStatus({ type: 'error', msg: error.response?.data?.message || 'Failed to send.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (batchId) => {
        if (!window.confirm('Are you sure you want to delete this broadcast? This will remove the notification for all recipients.')) return;

        try {
            await api.delete(`/notifications/broadcasts/${batchId}`);
            setBroadcasts(prev => prev.filter(b => b._id !== batchId));
            setStatus({ type: 'success', msg: 'Broadcast deleted successfully.' });
        } catch (error) {
            setStatus({ type: 'error', msg: 'Failed to delete broadcast.' });
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Send className="text-purple-400 w-6 h-6" /> Broadcast Notification
                </h2>

                {status.msg && (
                    <div className={`p-4 mb-4 rounded-lg ${status.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {status.msg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Recipient</label>
                        <select
                            className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            value={recipientType}
                            onChange={(e) => setRecipientType(e.target.value)}
                        >
                            <option value="all">All Users</option>
                            <option value="team">Specific Team</option>
                        </select>
                    </div>

                    {recipientType === 'team' && (
                        <div>
                            <label className="block text-gray-300 mb-2">Select Team</label>
                            <select
                                className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                                required
                            >
                                <option value="">-- Select a Team --</option>
                                {teams.map(team => (
                                    <option key={team._id} value={team._id}>
                                        {team.name} ({team.members.length + 1} members)
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-300 mb-2">Message</label>
                        <textarea
                            className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 h-32 resize-none"
                            placeholder="Type your announcement here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-purple-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                        Send Notification
                    </button>
                </form>
            </div>

            {/* Broadcast History */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <History className="text-blue-400 w-6 h-6" /> Recent Broadcasts
                </h3>

                <div className="space-y-4">
                    {broadcasts.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">No broadcast history found.</p>
                    ) : (
                        broadcasts.map((broadcast) => (
                            <div key={broadcast._id} className="bg-slate-900/50 rounded-lg p-4 border border-white/10 flex justify-between items-start">
                                <div>
                                    <p className="text-white mb-1">{broadcast.message}</p>
                                    <div className="flex gap-4 text-sm text-slate-400">
                                        <span>{format(new Date(broadcast.createdAt), 'MMM d, yyyy h:mm a')}</span>
                                        <span className="text-purple-400 flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {broadcast.recipientsCount} Recipients
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(broadcast._id)}
                                    className="text-red-400 hover:text-red-300 p-2 transition-colors"
                                    title="Delete Broadcast"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNotificationPanel;
