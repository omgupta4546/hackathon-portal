import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Upload, Github, FileText } from 'lucide-react';

const Submit = () => {
    const { roundId } = useParams();
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [driveLink, setDriveLink] = useState('');
    const [uploading, setUploading] = useState(false);
    const [existingSubmission, setExistingSubmission] = useState(null);

    useEffect(() => {
        const validateRound = async () => {
            try {
                // 1. Fetch Rounds to check validity
                const roundsRes = await api.get('/rounds');
                const rounds = roundsRes.data;
                const currentRound = rounds.find(r => r.roundId === roundId);

                if (!currentRound) {
                    toast.error('Invalid round');
                    navigate('/dashboard');
                    return;
                }

                // 2. Restrict to Round 2 only
                if (roundId !== 'round2') {
                    toast.error('Submissions are only open for Round 2');
                    navigate('/dashboard');
                    return;
                }

                // 3. Check if round is active
                const now = new Date();
                const start = new Date(currentRound.startAt);
                const end = new Date(currentRound.endAt);

                if (now < start) {
                    toast.error('Round has not started yet');
                    navigate('/dashboard');
                    return;
                }
                if (now > end) {
                    toast.error('Round has ended');
                    navigate('/dashboard');
                    return;
                }

                // 4. Check for existing submission
                const subsRes = await api.get('/submissions');
                const sub = subsRes.data.find(s => s.roundId === roundId);
                if (sub) setExistingSubmission(sub);

            } catch (err) {
                console.error(err);
                toast.error('Failed to validate round');
                navigate('/dashboard');
            }
        };

        validateRound();
    }, [roundId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setUploading(true);
        try {
            await api.post('/submissions', {
                roundId: roundId, // Use the actual roundId from params
                description,
                githubLink,
                driveLink
            });
            toast.success('Submitted successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Submission failed');
        } finally {
            setUploading(false);
        }
    };

    if (existingSubmission) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="card text-center py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Submission Received</h2>
                    <p className="text-slate-600 mb-6">You have already submitted for this round.</p>
                    <div className="bg-slate-50 p-4 rounded-lg max-w-md mx-auto text-left">
                        <p className="font-medium">Status: <span className="capitalize text-primary">{existingSubmission.status}</span></p>
                        <p className="text-sm text-red-500 mt-1">Submitted on: {new Date(existingSubmission.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="mt-8 btn-secondary">Back to Dashboard</button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-white mb-8">Submit Round {roundId === 'round1' ? '1' : '2'}</h1>

            <div className="card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Project Description</label>
                        <textarea
                            className="input-field h-32"
                            placeholder="Briefly describe your solution..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1 flex items-center">
                            <Github className="w-4 h-4 mr-1" /> Prototype Link <span className="text-slate-400 text-xs ml-2">(Optional)</span>
                        </label>
                        <input
                            type="url"
                            className="input-field"
                            placeholder="Link to your prototype (e.g., Figma, GitHub, Website)"
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1 flex items-center">
                            <FileText className="w-4 h-4 mr-1" /> Google Drive Link (PDF/PPT)
                        </label>
                        <input
                            type="url"
                            className="input-field"
                            placeholder="Paste your public Google Drive link here..."
                            value={driveLink}
                            onChange={(e) => setDriveLink(e.target.value)}
                            required
                        />
                        <p className="text-xs text-slate-400 mt-1">Make sure the link is set to "Anyone with the link can view"</p>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full btn-primary flex justify-center items-center"
                    >
                        {uploading ? 'Uploading...' : 'Submit Project'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Submit;
