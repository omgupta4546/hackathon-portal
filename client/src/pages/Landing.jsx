import { Link } from 'react-router-dom';
import { ArrowRight, Code, Cpu, Users, Zap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
    return (
        <div className="bg-transparent">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-transparent">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="sm:text-center lg:text-left"
                            >
                                <h1 className="text-4xl tracking-tight font-extrabold text-text sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Robotics Club</span>{' '}
                                    <span className="block text-primary xl:inline">Internal Hackathon</span>
                                </h1>
                                <p className="mt-3 text-base text-slate-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Join us for an electrifying 24-hour hackathon where hardware meets software. Innovate, build, and showcase your skills to win amazing prizes.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link to="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg">
                                            Register Now
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link to="/problems" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 md:py-4 md:text-lg">
                                            View Problems
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-dark/30 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative w-full h-64 sm:h-72 md:h-96 lg:h-full flex items-center justify-center"
                    >
                        <div className="text-9xl">🚀</div>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-text sm:text-4xl">
                            Everything you need to succeed
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            {[
                                {
                                    name: 'Hardware & Software',
                                    description: 'Choose from a variety of problem statements catering to both hardware enthusiasts and software developers.',
                                    icon: Cpu,
                                },
                                {
                                    name: 'Team Collaboration',
                                    description: 'Form teams of up to 4 members. Collaborate, innovate, and build something amazing together.',
                                    icon: Users,
                                },
                                {
                                    name: 'Mentorship',
                                    description: 'Get guidance from experienced mentors throughout the hackathon to refine your ideas and implementation.',
                                    icon: Zap,
                                },
                                {
                                    name: 'Exciting Prizes',
                                    description: 'Win cash prizes, swags, and certificates. Top teams get a chance to incubate their projects.',
                                    icon: Trophy,
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={feature.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative"
                                >
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-text">{feature.name}</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-slate-400">{feature.description}</dd>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
