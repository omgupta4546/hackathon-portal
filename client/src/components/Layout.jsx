import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import InstructionModal from './InstructionModal';

const Layout = () => {
    const location = useLocation();
    return (
        <div className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden">
            {/* Flying Rocket Animation - Only on Landing Page */}
            {location.pathname === '/' && (
                <motion.div
                    className="absolute text-6xl z-0 pointer-events-none"
                    initial={{ x: -100, y: '50vh' }}
                    animate={{
                        x: ['0vw', '110vw'],
                        y: ['50vh', '20vh', '70vh', '30vh']
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                >
                    🚀
                </motion.div>
            )}

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <footer className="bg-slate-800 border-t border-slate-700 py-6">
                    <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
                        © {new Date().getFullYear()} Robotics Club Hackathon — Built with ❤️ & Caffeine by Om Gupta
                    </div>
                </footer>
                <Toaster position="top-right" />
                <InstructionModal />
            </div>
        </div>
    );
};

export default Layout;
