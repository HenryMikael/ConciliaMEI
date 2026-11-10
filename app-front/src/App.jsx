import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import HeroSection from './components/HeroSection';
import NotasFiscais from './pages/fiscal/NotasFiscais';
import Conciliacao from './pages/fiscal/Conciliacao';
import Pagamentos from './pages/fiscal/Pagamentos';
import PrivateRoute from './routes/PrivateRoute';
import LoginPage from './pages/auth/login/LoginPage';
import RegisterPage from './pages/auth/register/RegisterPage';
import RegisterCompany from './pages/auth/register/RegisterCompany';
import CompanyConfirmation from './pages/auth/register/CompanyConfirmation';
import ResetPasswordPage from './pages/auth/password-recovery/ResetPasswordPage';
import ForgotPasswordPage from './pages/auth/password-recovery/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas (Sem Navbar) */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/auth/sign-up" element={<LoginPage />} />
        <Route path="/auth/signin" element={<RegisterPage />} />
        <Route path="/auth/register-company" element={<RegisterCompany />} />
        <Route path="/auth/register-company/confirm" element={<CompanyConfirmation />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

        {/* Rotas Privadas (Com Navbar) */}
        <Route element={<PrivateRoute />}>
          <Route element={<Navbar />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/notas" element={<NotasFiscais />} />
            <Route path="/conciliacao" element={<Conciliacao />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;