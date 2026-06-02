import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import GuestRoute from './components/layout/GuestRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import SavedJobs from './pages/SavedJobs';
import JobAlerts from './pages/JobAlerts';
import Admin from './pages/Admin';
import Messages from './pages/Messages';
import Analytics from './pages/Analytics';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';
import Applicants from './pages/Applicants';
import Notifications from './pages/Notifications';
import Pipeline from './pages/Pipeline';
import CompanyPage from './pages/CompanyPage';
import Interviews from './pages/Interviews';

const publicLayout = (page) => <Layout>{page}</Layout>;
const protectedLayout = (page, roles) => (
  <ProtectedRoute roles={roles}>
    <Layout>{page}</Layout>
  </ProtectedRoute>
);

const App = () => (
  <HelmetProvider>
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <Toaster position="top-right" />
              <Routes>
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/" element={publicLayout(<Home />)} />
                <Route path="/jobs" element={publicLayout(<Jobs />)} />
                <Route path="/jobs/:id" element={publicLayout(<JobDetail />)} />
                <Route path="/companies/:id" element={publicLayout(<CompanyPage />)} />
                <Route path="/dashboard" element={protectedLayout(<Dashboard />)} />
                <Route path="/profile" element={protectedLayout(<Profile />)} />
                <Route path="/applications" element={protectedLayout(<Applications />, ['jobseeker'])} />
                <Route path="/saved-jobs" element={protectedLayout(<SavedJobs />, ['jobseeker'])} />
                <Route path="/alerts" element={protectedLayout(<JobAlerts />)} />
                <Route path="/notifications" element={protectedLayout(<Notifications />)} />
                <Route path="/pipeline" element={protectedLayout(<Pipeline />, ['employer', 'admin'])} />
                <Route path="/interviews" element={protectedLayout(<Interviews />)} />
                <Route path="/messages" element={protectedLayout(<Messages />)} />
                <Route path="/messages/:userId" element={protectedLayout(<Messages />)} />
                <Route path="/analytics" element={protectedLayout(<Analytics />, ['employer', 'admin'])} />
                <Route path="/admin" element={protectedLayout(<Admin />, ['admin'])} />
                <Route path="/jobs/new" element={protectedLayout(<PostJob />, ['employer', 'admin'])} />
                <Route path="/jobs/:id/edit" element={protectedLayout(<EditJob />, ['employer', 'admin'])} />
                <Route path="/jobs/:jobId/applicants" element={protectedLayout(<Applicants />, ['employer', 'admin'])} />
                <Route path="*" element={publicLayout(<NotFound />)} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
