import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PricingPlan from './pages/auth/PricingPlan';
import AdminDashboard from './pages/admin/AdminDashboard';
import EditMovie from './pages/admin/EditMovie';
import CreateMovie from './pages/admin/CreateMovie';
import ManageGenres from './pages/admin/ManageGenres';
import EditGenre from './pages/admin/EditGenre';
import EditActor from './pages/admin/EditActor';
import EditUser from './pages/admin/EditUser';
import UserDashboard from './pages/user/UserDashboard';
import Profile from './pages/user/Profile';
import MovieDetail from './pages/MovieDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />

        {/* Guest Routes - Redirects to dashboard if logged in */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <GuestRoute>
              <PricingPlan />
            </GuestRoute>
          }
        />

        {/* Authenticated User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/movies/edit/:id"
          element={
            <AdminRoute>
              <EditMovie />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/movies/create"
          element={
            <AdminRoute>
              <CreateMovie />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/genres"
          element={
            <AdminRoute>
              <ManageGenres />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/genres/edit/:id"
          element={
            <AdminRoute>
              <EditGenre />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/actors/edit/:id"
          element={
            <AdminRoute>
              <EditActor />
            </AdminRoute>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route
          path="/admin/users/edit/:id"
          element={
            <AdminRoute>
              <EditUser />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;