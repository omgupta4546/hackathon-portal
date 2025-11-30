import { useState, useEffect } from 'react';
import api, { BASE_URL } from '../utils/api';
import toast from 'react-hot-toast';
import { Download, Check, X, Trash2, Edit, Plus, Save } from 'lucide-react';

const AdminDashboard = () => {
    const [teams, setTeams] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [problems, setProblems] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('teams');

    // Form States
    const [editingProblem, setEditingProblem] = useState(null);
    const [newProblem, setNewProblem] = useState({ title: '', category: 'Software', description: '', maxTeamSize: 4 });
    const [editingRound, setEditingRound] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [teamsRes, subsRes, probsRes, roundsRes] = await Promise.all([
                api.get('/admin/teams'),
                api.get('/submissions'),
                api.get('/problems'),
                api.get('/rounds')
            ]);
            setTeams(teamsRes.data);
            setSubmissions(subsRes.data);
            setProblems(probsRes.data);
            setRounds(roundsRes.data);
        } catch (error) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    // --- Team Actions ---
    const deleteTeam = async (id) => {
        if (!window.confirm('Are you sure? This will delete the team and all their submissions.')) return;
        try {
            await api.delete(`/admin/teams/${id}`);
            toast.success('Team deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete team');
        }
    };

    // --- Submission Actions ---
    const updateStatus = async (id, status) => {
        try {
            await api.put(`/admin/submissions/${id}/status`, { status });
            toast.success(`Marked as ${status}`);
            fetchData();
        } catch (err) {
            toast.error('Failed to update status');
        }
    }

    // --- Problem Actions ---
    const handleCreateProblem = async (e) => {
        e.preventDefault();
        try {
            await api.post('/problems', newProblem);
            toast.success('Problem created');
            setNewProblem({ title: '', category: 'Software', description: '', maxTeamSize: 4 });
            fetchData();
        } catch (err) {
            toast.error('Failed to create problem');
        }
    };

    const handleDeleteProblem = async (id) => {
        if (!window.confirm('Delete this problem statement?')) return;
        try {
            await api.delete(`/problems/${id}`);
            toast.success('Problem deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete problem');
        }
    };

    // --- Round Actions ---
    const handleUpdateRound = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/rounds/${editingRound.roundId}`, editingRound);
            toast.success('Round updated');
            setEditingRound(null);
            fetchData();
        } catch (err) {
            toast.error('Failed to update round');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading admin panel...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

            <div className="flex space-x-4 mb-6 border-b border-slate-200 overflow-x-auto">
                {['teams', 'submissions', 'problems', 'rounds'].map(tab => (
                    <button
                        key={tab}
                        className={`pb-2 px-4 font-medium capitalize whitespace-nowrap ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* TEAMS TAB */}
            {activeTab === 'teams' && (
                <div className="card overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Team Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Leader</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Members</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Problem</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-slate-100 divide-y divide-slate-200">
                            {teams.map((team) => (
                                <tr key={team._id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{team.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                                        {team.members.find(m => m.userId === team.leaderUserId)?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{team.members.length}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 truncate max-w-xs">
                                        {team.problemId ? team.problemId.title : <span className="text-slate-400">Not Selected</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                                        <button onClick={() => deleteTeam(team._id)} className="text-red-600 hover:text-red-900 flex items-center">
                                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* SUBMISSIONS TAB */}
            {activeTab === 'submissions' && (
                <div className="card overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Team</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Round</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Links</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-slate-100 divide-y divide-slate-200">
                            {submissions.map((sub) => (
                                <tr key={sub._id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{sub.teamId?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{sub.roundId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                        {sub.githubLink && <a href={sub.githubLink} target="_blank" rel="noreferrer" className="hover:underline mr-2">GitHub</a>}
                                        {sub.files.length > 0 && <a href={`${BASE_URL}${sub.files[0].url}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center inline-flex"><Download className="w-3 h-3 mr-1" /> File</a>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                                            sub.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => updateStatus(sub._id, 'shortlisted')} className="text-green-600 hover:text-green-900" title="Shortlist"><Check className="w-5 h-5" /></button>
                                        <button onClick={() => updateStatus(sub._id, 'rejected')} className="text-red-600 hover:text-red-900" title="Reject"><X className="w-5 h-5" /></button>
                                        <button onClick={() => updateStatus(sub._id, 'submitted')} className="text-yellow-600 hover:text-yellow-900" title="Reset"><Edit className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* PROBLEMS TAB */}
            {activeTab === 'problems' && (
                <div className="space-y-8">
                    {/* Create Problem */}
                    <div className="card bg-blue-200">
                        <h3 className="font-bold text-black text-lg mb-4 flex items-center"><Plus className="w-5 h-5 mr-2 text-black" /> Add New Problem</h3>
                        <form onSubmit={handleCreateProblem} className="grid md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Title" className="input-field" value={newProblem.title} onChange={e => setNewProblem({ ...newProblem, title: e.target.value })} required />
                            <select className="input-field" value={newProblem.category} onChange={e => setNewProblem({ ...newProblem, category: e.target.value })}>
                                <option value="Software">Software</option>
                                <option value="Hardware">Hardware</option>
                                <option value="Both">Both</option>
                            </select>
                            <textarea placeholder="Description" className="input-field md:col-span-2" value={newProblem.description} onChange={e => setNewProblem({ ...newProblem, description: e.target.value })} required />
                            <button type="submit" className="btn-primary">Create Problem</button>
                        </form>
                    </div>

                    {/* List Problems */}
                    <div className="grid gap-4">
                        {problems.map(p => (
                            <div key={p._id} className="card flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold">{p.title}</h4>
                                    <p className="text-sm text-red-500">{p.category}</p>
                                </div>
                                <button onClick={() => handleDeleteProblem(p._id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-5 h-5" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ROUNDS TAB */}
            {activeTab === 'rounds' && (
                <div className="space-y-6">
                    {rounds.map(round => (
                        <div key={round._id} className="card">
                            {editingRound?._id === round._id ? (
                                <form onSubmit={handleUpdateRound} className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-lg">Editing {round.name}</h3>
                                        <button type="button" onClick={() => setEditingRound(null)}><X className="w-5 h-5" /></button>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">Start Date</label>
                                            <input type="date" className="input-field"
                                                value={editingRound.startAt ? editingRound.startAt.split('T')[0] : ''}
                                                onChange={e => setEditingRound({ ...editingRound, startAt: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">End Date</label>
                                            <input type="date" className="input-field"
                                                value={editingRound.endAt ? editingRound.endAt.split('T')[0] : ''}
                                                onChange={e => setEditingRound({ ...editingRound, endAt: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium">Description</label>
                                            <textarea className="input-field" value={editingRound.description} onChange={e => setEditingRound({ ...editingRound, description: e.target.value })} />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary flex items-center"><Save className="w-4 h-4 mr-2" /> Save Changes</button>
                                </form>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{round.name}</h3>
                                        <p className="text-slate-600">{round.description}</p>
                                        <p className="text-sm text-red-500 mt-2">
                                            {round.startAt ? new Date(round.startAt).toLocaleDateString() : 'TBA'} - {round.endAt ? new Date(round.endAt).toLocaleDateString() : 'TBA'}
                                        </p>
                                    </div>
                                    <button onClick={() => setEditingRound(round)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit className="w-5 h-5" /></button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
