import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Menu, X, LogOut, User, Shield, Bell, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const handleNotificationClick = (id) => {
        markAsRead(id);
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
                                {/* Notification Bell */}
                                <div className="relative" ref={notificationRef}>
                                    <button
                                        onClick={toggleNotifications}
                                        className="text-slate-300 hover:text-primary p-2 rounded-full relative"
                                    >
                                        <Bell className="w-5 h-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Notification Dropdown */}
                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-slate-200">
                                            <div className="flex justify-between items-center px-4 py-2 bg-slate-100 border-b border-slate-200">
                                                <h3 className="text-sm font-semibold text-slate-700">Notifications</h3>
                                                {unreadCount > 0 && (
                                                    <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline">
                                                        Mark all read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="px-4 py-6 text-center text-slate-500 text-sm">
                                                        No notifications
                                                    </div>
                                                ) : (
                                                    notifications.map(notification => (
                                                        <div
                                                            key={notification._id}
                                                            className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${notification.isRead ? 'opacity-60' : 'bg-blue-50/30'}`}
                                                            onClick={() => handleNotificationClick(notification._id)}
                                                        >
                                                            <div className="flex items-start">
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-slate-800">{notification.message}</p>
                                                                    <p className="text-xs text-slate-500 mt-1">
                                                                        {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </p>
                                                                </div>
                                                                {!notification.isRead && (
                                                                    <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-600 rounded-full"></span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

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
                                <Link to="/notifications" className="block text-slate-300 hover:text-primary px-3 py-2 rounded-md text-base font-medium flex items-center justify-between">
                                    Notifications
                                    {unreadCount > 0 && (
                                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
                                    )}
                                </Link>
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
