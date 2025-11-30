import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProblemStatements from './pages/ProblemStatements';
import Submit from './pages/Submit';
import AdminDashboard from './pages/AdminDashboard';
import Rounds from './pages/Rounds';
import Winners from './pages/Winners';
import Help from './pages/Help';

import AuthCallback from './pages/AuthCallback';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Landing />} />
                        <Route path="login" element={<Login />} />
                        <Route path="auth/callback" element={<AuthCallback />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="problems" element={<ProblemStatements />} />
                        <Route path="rounds" element={<Rounds />} />
                        <Route path="winners" element={<Winners />} />
                        <Route path="help" element={<Help />} />

                        <Route path="dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="submit/:roundId" element={
                            <ProtectedRoute>
                                <Submit />
                            </ProtectedRoute>
                        } />

                        <Route path="admin" element={
                            <ProtectedRoute adminOnly>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
