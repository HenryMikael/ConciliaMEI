import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout, { AuthDivider, AuthField, AuthNotice, GoogleButton } from '../../../components/layout/AuthLayout';
import { login } from "../../../api/authApi";
import { getMyCompany } from "../../../api/companyApi";
import LGPDpopup from '../../../components/ui/LGPDpopup';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        setErro("");
        setCarregando(true);


        try {
            const respostaLogin = await login(email, password);

            if (!respostaLogin?.token) {
                throw new Error("O servidor não retornou um token de autenticação.");
            }

            const { name, token } = respostaLogin;

            localStorage.setItem("token", token);
            localStorage.setItem("name", name || "");

            const company = await getMyCompany();
            navigate(company ? "/dashboard" : "/auth/register-company", { replace: true });

        } catch (err) {
            setErro(err.message || "Erro ao tentar fazer login.");
        } finally {
            setCarregando(false);
        }

    }

    return (
        <AuthLayout
            title="Bem-vindo!"
            description={
                <>
                    Acesse sua conta para continuar
                    <br className="desktop-break" />
                    com a conciliação das suas notas fiscais.
                </>
            }
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <AuthField
                    id="login-email"
                    label="E-mail"
                    icon={Mail}
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <AuthField
                    id="login-password"
                    label="Senha"
                    icon={LockKeyhole}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    trailing={
                        <button
                            className="password-toggle"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                                showPassword
                                    ? 'Ocultar senha'
                                    : 'Mostrar senha'
                            }
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    }
                />
                <div className="auth-options">
                    <label className="remember-option">
                        <input type="checkbox" defaultChecked />
                        <span>Lembrar de mim</span>
                    </label>

                    <Link
                        className="text-action"
                        to="/auth/forgot-password"
                    >
                        Esqueceu sua senha?
                    </Link>
                </div>
                {erro && (
                    <AuthNotice>
                        {erro}
                    </AuthNotice>
                )}
                <button
                    className="auth-button auth-button-primary"
                    type="submit"
                    disabled={carregando}
                >
                    {carregando ? "Entrando..." : "Entrar"}
                    {!carregando && <ArrowRight />}
                </button>
            </form>
            <AuthDivider />
            <GoogleButton
                onClick={() =>
                    setErro("O acesso com Google ainda não está configurado.")
                }
            >
                Entrar com Google
            </GoogleButton>
            <Link className="auth-login-link" to="/auth/signin">Criar uma conta</Link>

            <LGPDpopup /> {/* LGPD */}
        </AuthLayout>
    );
}