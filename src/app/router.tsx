import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { AcademicPage } from '../pages/academic/AcademicPage';
import { StudentsPage } from '../pages/students/StudentsPage';
import { TeachersPage } from '../pages/teachers/TeachersPage';
import { AttendancePage } from '../pages/attendance/AttendancePage';
import { FeeStructurePage } from '../pages/fees/FeeStructurePage';
import { PaymentsPage } from '../pages/fees/PaymentsPage';
import { FeeDashboardPage } from '../pages/fees/FeeDashboardPage';
import { ExamsPage } from '../pages/examination/ExamsPage';
import { ResultsPage } from '../pages/examination/ResultsPage';
import { RankingsPage } from '../pages/examination/RankingsPage';
import { UsersPage } from '../pages/administration/UsersPage';
import { SchoolsPage } from '../pages/administration/SchoolsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { HomeworkPage } from '../pages/homework/HomeworkPage';
import { ClassRoutinePage } from '../pages/routine/ClassRoutinePage';
import { AnnouncementsPage } from '../pages/announcements/AnnouncementsPage';
import StudentFeesPage from '../pages/fees/StudentFeesPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/academic"
        element={
          <ProtectedRoute>
            <AcademicPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/routine"
        element={
          <ProtectedRoute>
            <ClassRoutinePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/homework"
        element={
          <ProtectedRoute>
            <HomeworkPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <AnnouncementsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <StudentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teachers"
        element={
          <ProtectedRoute>
            <TeachersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <AttendancePage />
          </ProtectedRoute>
        }
      />

      {/* Fees Module Routes */}
      <Route
        path="/fees/structure"
        element={
          <ProtectedRoute>
            <FeeStructurePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fees/student-fees"
        element={
          <ProtectedRoute>
            <StudentFeesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fees/payments"
        element={
          <ProtectedRoute>
            <PaymentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fees/dashboard"
        element={
          <ProtectedRoute>
            <FeeDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Examination Routes */}
      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <ExamsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rankings"
        element={
          <ProtectedRoute>
            <RankingsPage />
          </ProtectedRoute>
        }
      />

      {/* Administration Routes */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/schools"
        element={
          <ProtectedRoute>
            <SchoolsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
