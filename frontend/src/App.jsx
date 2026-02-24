import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

// PASSWORD RESET
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Employee Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import MyExpenses from './pages/MyExpenses';
import AddExpense from './pages/AddExpense';
import EmployeeProfile from './pages/EmployeeProfile';

// Manager Pages
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerApprovals from './pages/ManagerApprovals';
import ManagerProfile from './pages/ManagerProfile'; // 👈 NEW

// Finance Pages
import FinanceDashboard from './pages/FinanceDashboard';
import FinancePayouts from './pages/FinancePayouts';
import FinanceProfile from './pages/FinanceProfile'; // 👈 NEW (Ready for next step)

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        {/* ================= EMPLOYEE ROUTES ================= */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <EmployeeDashboard /> 
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-expenses" 
          element={
            <ProtectedRoute>
              <MyExpenses /> 
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-expense" 
          element={
            <ProtectedRoute>
              <AddExpense /> 
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <EmployeeProfile /> 
            </ProtectedRoute>
          } 
        />

        {/* ================= MANAGER ROUTES ================= */}
        <Route 
          path="/manager-dashboard" 
          element={
            <ProtectedRoute>
              <ManagerDashboard /> 
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/approvals" 
          element={
            <ProtectedRoute>
              <ManagerApprovals /> 
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/profile" 
          element={
            <ProtectedRoute>
              <ManagerProfile /> 
            </ProtectedRoute>
          } 
        />

        {/* ================= FINANCE ROUTES ================= */}
        <Route 
          path="/finance-dashboard" 
          element={
            <ProtectedRoute>
              <FinanceDashboard /> 
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/finance/payouts" 
          element={
            <ProtectedRoute>
              <FinancePayouts /> 
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/finance/profile" 
          element={
            <ProtectedRoute>
              <FinanceProfile /> 
            </ProtectedRoute>
          } 
        />

        {/* ================= CATCH-ALL ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;