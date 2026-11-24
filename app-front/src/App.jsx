import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Componentes
import Navbar from './components/ui/Navbar';
import HeroSection from './components/HeroSection';

// Páginas de autenticação
import LoginPage from './pages/auth/login/LoginPage';
import RegisterPage from './pages/auth/register/RegisterPage';

import ResetPasswordPage from './pages/auth/password-recovery/ResetPasswordPage';
import ForgotPasswordPage from './pages/auth/password-recovery/ForgotPasswordPage';

// Página do Usuario
import DashboardPage from './pages/dashboard/DashboardPage';
import NotasFiscais from './pages/fiscal/NotasFiscais';
import Conciliacao from './pages/fiscal/Conciliacao';
import Pagamentos from './pages/fiscal/Pagamentos';

// Rotas privadas
//import PrivateRoute from './routes/PrivateRoute';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas (Sem Navbar) */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/auth/sign-up" element={<LoginPage />} />
        <Route path="/auth/signin" element={<RegisterPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

        {/* Rotas Privadas (Com Navbar) */}
        {/*<Route element={<PrivateRoute />}>*/}
          <Route element={<Navbar />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/notas" element={<NotasFiscais />} />
            <Route path="/conciliacao" element={<Conciliacao />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
          </Route>
        {/*</Route>*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;