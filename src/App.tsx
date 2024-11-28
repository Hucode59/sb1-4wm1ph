import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Header } from './components/Header';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { DashboardPage } from './pages/Dashboard';
import { AccountPage } from './pages/Account';
import { GoalsPage } from './pages/Goals';
import { InvestmentsPage } from './pages/Investments';
import { FinAIPage } from './pages/FinAI';
import { BankCallback } from './pages/BankCallback';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <Features />
                <HowItWorks />
                <Pricing />
                <Footer />
              </>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/bank-callback" element={<BankCallback />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AccountPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/goals" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <GoalsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/investments" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <InvestmentsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/finai" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FinAIPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;