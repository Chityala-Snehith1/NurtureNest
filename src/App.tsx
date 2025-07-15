import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import EmergencyButton from './components/EmergencyButton';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import Forum from './pages/Forum';
import Consultations from './pages/Consultations';
import VirtualConsultation from './pages/VirtualConsultation';
import InPersonAppointmentPage from './pages/InPersonAppointmentPage';
import UrgentCarePage from './pages/UrgentCarePage';
import MLInsights from './pages/MLInsights';
import { useAuth } from './hooks/useAuth';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="relative">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/urgent-care" element={<UrgentCarePage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/forum" 
              element={
                <ProtectedRoute>
                  <Forum />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/consultations" 
              element={
                <ProtectedRoute>
                  <Consultations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/virtual-consultation" 
              element={
                <ProtectedRoute>
                  <VirtualConsultation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/in-person-appointment" 
              element={
                <ProtectedRoute>
                  <InPersonAppointmentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ml-insights" 
              element={
                <ProtectedRoute>
                  <MLInsights />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community" 
              element={
                <ProtectedRoute>
                  <Forum />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Page not found</p>
                    <a 
                      href="/" 
                      className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition duration-300"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              } 
            />
          </Routes>
        </main>
        
        {/* Emergency Button - Always visible */}
        <EmergencyButton />
      </div>
    </Router>
  );
}

export default App;
