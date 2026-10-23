import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './components/sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import NotasFiscais from './pages/fiscal/NotasFiscais';
import Concialiacao from './pages/fiscal/conciliacao';
import Pagamentos from './pages/fiscal/Pagamentos';
import Configuracao from './pages/settings/Configuracao';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RegisterCompany  from './pages/auth/RegisterCompany';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

function App() {
  // TODO: trocar pelo usuário do login (JWT), no formato { name, cnpj }
  const [collapsed, setCollapsed] = useState(false);
  const user = null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/register-company" element={<RegisterCompany />} /> {/* teste - essa tela deve aparecer assim que o cadastro de usuario for realizado */}
        {/* Testes */}
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} /> 
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} /> 
        <Route
          path="*"
          element={
            <div className="flex min-h-screen">
              <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
              <main className="flex-1">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/notas" element={<NotasFiscais />} />
                  <Route path="/conciliacao" element={<Concialiacao />} />
                  <Route path="/pagamentos" element={<Pagamentos />} />
                  <Route path="/configuracoes" element={<Configuracao />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;