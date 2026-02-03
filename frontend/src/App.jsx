import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

// Employee Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import MyExpenses from './pages/MyExpenses';
import AddExpense from './pages/AddExpense';
import EmployeeProfile from './pages/EmployeeProfile'; // <--- IMPORT THIS

// Manager Pages
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerApprovals from './pages/ManagerApprovals';

// Finance Pages
import FinanceDashboard from './pages/FinanceDashboard';
import FinancePayouts from './pages/FinancePayouts';

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

        {/* 👇 NEW PROFILE ROUTE (Fixes the redirection issue) 👇 */}
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

        {/* ================= CATCH-ALL ================= */}
        {/* Redirect unknown URLs to Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;