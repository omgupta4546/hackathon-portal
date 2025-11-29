import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { googleLogin } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            googleLogin(token)
                .then(() => {
                    toast.success('Logged in with Google successfully!');
                    navigate('/dashboard');
                })
                .catch((error) => {
                    console.error(error);
                    toast.error('Google login failed');
                    navigate('/login');
                });
        } else {
            navigate('/login');
        }
    }, [searchParams, googleLogin, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="text-white text-xl">Processing login...</div>
        </div>
    );
};

export default AuthCallback;
