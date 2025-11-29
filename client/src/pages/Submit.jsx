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
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [existingSubmission, setExistingSubmission] = useState(null);

    useEffect(() => {
        // Check for existing submission
        const checkSubmission = async () => {
            try {
                const { data } = await api.get('/submissions');
                const sub = data.find(s => s.roundId === roundId);
                if (sub) setExistingSubmission(sub);
            } catch (err) {
                console.error(err);
            }
        }
        checkSubmission();
    }, [roundId]);

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            return toast.error('Please upload a file');
        }

        const formData = new FormData();
        formData.append('roundId', roundId || 'round1');
        formData.append('description', description);
        formData.append('githubLink', githubLink);
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        setUploading(true);
        try {
            await api.post('/submissions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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
                            <Github className="w-4 h-4 mr-1" /> GitHub Repository Link
                        </label>
                        <input
                            type="url"
                            className="input-field"
                            placeholder="https://github.com/username/repo"
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1 flex items-center">
                            <FileText className="w-4 h-4 mr-1" /> Presentation (PDF/PPTX)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                                <div className="flex text-sm text-slate-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500 focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.pptx,.ppt,.doc,.docx" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-slate-500">PDF, PPTX up to 10MB</p>
                                {files.length > 0 && (
                                    <p className="text-sm text-green-600 font-medium mt-2">{files[0].name}</p>
                                )}
                            </div>
                        </div>
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
