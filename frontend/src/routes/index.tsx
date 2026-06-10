import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Members from '../pages/Members';
import Settings from '../pages/Settings';
import Unauthorized from '../pages/Unauthorized';
import StudentsListPage from '../pages/students/StudentsListPage';
import CreateStudentPage from '../pages/students/CreateStudentPage';
import EditStudentPage from '../pages/students/EditStudentPage';
import StudentDetailsPage from '../pages/students/StudentDetailsPage';
import MeetingsListPage from '../pages/meetings/MeetingsListPage';
import CreateMeetingPage from '../pages/meetings/CreateMeetingPage';
import MeetingDetailsPage from '../pages/meetings/MeetingDetailsPage';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings"
          element={
            <ProtectedRoute>
              <MeetingsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/create"
          element={
            <ProtectedRoute>
              <CreateMeetingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/:id"
          element={
            <ProtectedRoute>
              <MeetingDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <Members />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

         <Route
          path="/students"
          element={
            <ProtectedRoute>
             <StudentsListPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="students/create"
          element={
            <ProtectedRoute>
              <CreateStudentPage />
            </ProtectedRoute>
          }
        />
<Route
          path="students/:id"
          element={
            <ProtectedRoute>
              <StudentDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="students/:id/edit"
          element={
            <ProtectedRoute>
              <EditStudentPage />
            </ProtectedRoute>
          }
        />
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
