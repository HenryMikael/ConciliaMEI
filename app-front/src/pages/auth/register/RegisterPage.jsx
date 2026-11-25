import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout, {
    AuthDivider,
    AuthField,
    AuthNotice,
    GoogleButton
} from '../../../components/layout/AuthLayout';

import { register } from '../../../api/authApi';

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [notice, setNotice] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        setErro("");
        setNotice("");
        setCarregando(true);

        try {
            await register(name, email, password);

            navigate("/auth/sign-up", {
                state: {
                    registered: true,
                    email
                }
            });
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <AuthLayout
            title="Crie sua conta"
            description={
                <>
                    Preencha os dados abaixo para começar a usar
                    <br className="desktop-break" />
                    o ConciliaMEI e ter mais controle sobre seu financeiro.
                </>
            }
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <AuthField
                    id="register-name"
                    label="Nome"
                    icon={User}
                    type="text"
                    placeholder="Nome"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={carregando}
                    required
                />

                <AuthField
                    id="register-email"
                    label="E-mail"
                    icon={Mail}
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={carregando}
                    required
                />

                <AuthField
                    id="register-password"
                    label="Senha"
                    icon={LockKeyhole}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={carregando}
                    required
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

                {erro && <AuthNotice>{erro}</AuthNotice>}

                <button
                    className="auth-button auth-button-primary"
                    type="submit"
                    disabled={carregando}
                >
                    {carregando ? "Criando conta..." : "Registrar"}
                    {!carregando && <ArrowRight />}
                </button>
            </form>

            <AuthDivider />

            <GoogleButton
                onClick={() => setNotice('O cadastro com Google ainda não está configurado.')}
            >
                Registrar com Google
            </GoogleButton>

            {notice && <AuthNotice>{notice}</AuthNotice>}

            <Link className="auth-login-link" to="/auth/sign-up">
                Já tenho login
            </Link>
        </AuthLayout>
    );
}
