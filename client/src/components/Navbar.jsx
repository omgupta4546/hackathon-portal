import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User, Shield } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center flex-1 md:flex-none justify-between md:justify-start">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <img src="/assets/robotics-logo.jpg" alt="Robotics Club" className="h-10 w-auto rounded-full" />
                            <span className="text-xl font-bold text-primary hidden sm:block">Robotics Club</span>
                        </Link>


                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/problems" className="text-slate-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Problem Statements</Link>
                        <Link to="/rounds" className="text-slate-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Rounds</Link>
                        <Link to="/winners" className="text-slate-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Winners</Link>
                        <Link to="/info" className="text-slate-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Info</Link>
                        <Link to="/help" className="text-slate-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Help</Link>

                        {user ? (
                            <>
                                {user.role === 'admin' ? (
                                    <Link to="/admin" className="flex items-center text-slate-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                                        <Shield className="w-4 h-4 mr-1" /> Admin
                                    </Link>
                                ) : (
                                    <Link to="/dashboard" className="flex items-center text-slate-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                                        <User className="w-4 h-4 mr-1" /> Dashboard
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium">
                                    <LogOut className="w-4 h-4 mr-1" /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-slate-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                <Link to="/signup" className="btn-primary text-sm">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-800 border-b border-slate-700">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/problems" className="block text-slate-300 hover:text-primary px-3 py-2 rounded-md text-base font-medium">Problem Statements</Link>
                        <Link to="/rounds" className="block text-slate-300 hover:text-primary px-3 py-2 rounded-md text-base font-medium">Rounds</Link>
                        <Link to="/winners" className="block text-slate-300 hover:text-primary px-3 py-2 rounded-md text-base font-medium">Winners</Link>
                        <Link to="/info" className="block text-slate-300 hover:text-primary px-3 py-2 rounded-md text-base font-medium">Info</Link>
                        <Link to="/help" className="block text-slate-300 hover:text-primary px-3 py-2 rounded-md text-base font-medium">Help</Link>
                        {user ? (
                            <>
                                <Link to={user.role === 'admin' ? "/admin" : "/dashboard"} className="block text-slate-300 hover:text-primary px-3 py-2 rounded-md text-base font-medium">
                                    {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left block text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-base font-medium">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block text-slate-300 hover:text-primary px-3 py-2 rounded-md text-base font-medium">Login</Link>
                                <Link to="/signup" className="block text-primary font-medium px-3 py-2 rounded-md text-base">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
