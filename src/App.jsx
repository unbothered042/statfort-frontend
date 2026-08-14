import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import Elite from './pages/Elite';
import Community from './pages/Community';
import CategoryPage from './pages/CategoryPage';
import PostPage from './pages/PostPage';
import Contact from './pages/Contact';
import HelpButton from './components/HelpButton';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/elite" element={<ProtectedRoute><Elite /></ProtectedRoute>} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/community/:categorySlug" element={<CategoryPage />} />
                    <Route path="/community/post/:postId" element={<PostPage />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
                <HelpButton />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;