import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes
import Navbar from './components/ui/Navbar';
import HeroSection from './components/HeroSection';

// Páginas de autenticação
import LoginPage from './pages/auth/login/LoginPage';
import RegisterPage from './pages/auth/register/RegisterPage';

import ResetPasswordPage from './pages/auth/password-recovery/ResetPasswordPage';
import ForgotPasswordPage from './pages/auth/password-recovery/ForgotPasswordPage';

// Páginas privadas
import DashboardPage from './pages/dashboard/DashboardPage';
import Conciliacao from './pages/fiscal/Conciliacao';
import Pagamentos from './pages/fiscal/Pagamentos';
import Extratos from './pages/fiscal/Extratos';
import Settings from './pages/settings/SettingsPage';

// Proteção de rotas
import PrivateRoute from './routes/PrivateRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<HeroSection />} />
                <Route path="/auth/sign-up" element={<LoginPage />} />
                <Route path="/auth/signin" element={<RegisterPage />} />
                <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                

                {/* Rotas privadas */}
                <Route element={<PrivateRoute />}>
                    <Route element={<Navbar />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/conciliacao" element={<Conciliacao />} />
                        <Route path="/pagamentos" element={<Pagamentos />} />
                        <Route path="/extratos" element={<Extratos />} />
                        <Route path="/settings" element={<Settings />} />
                        
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
