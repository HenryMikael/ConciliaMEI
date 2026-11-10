import { useState } from "react";
import {
    ArrowRight,
    Building2,
    Check,
    ChevronLeft,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { consultCnpj, SessionExpiredError } from "../../../api/companyApi";
import { formatCnpj, isValidCnpj, onlyDigits } from "../../../lib/cnpj";

function Brand() {
    return (
        <Link to="/" className="inline-flex items-center gap-2.5" aria-label="ConciliaMEI - início">
            <span className="grid size-9 place-items-center rounded-xl bg-(--brand-primary) text-white shadow-sm">
                <Building2 size={19} strokeWidth={2.2} />
            </span>
            <span className="text-xl font-bold tracking-tight text-(--text-primary)">
                Concilia<span className="text-(--brand-primary)">MEI</span>
            </span>
        </Link>
    );
}

function ProgressStep({ number, title, description, completed, active }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <span
                className={`grid size-9 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-colors ${completed
                        ? "border-(--brand-primary) bg-(--brand-primary) text-white"
                        : active
                            ? "border-(--brand-primary) bg-(--brand-primary-soft) text-(--brand-primary)"
                            : "border-(--border-default) bg-(--surface-card) text-(--text-muted)"
                    }`}
            >
                {completed ? <Check size={17} /> : number}
            </span>
            <span className="min-w-0">
                <span className={`block truncate text-sm font-semibold ${active || completed ? "text-(--text-primary)" : "text-(--text-muted)"}`}>
                    {title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-(--text-muted)">
                    {description}
                </span>
            </span>
        </div>
    );
}

export default function RegisterCompany() {
    const [cnpj, setCnpj] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    if (!localStorage.getItem("token")) {
        return <Navigate to="/auth/sign-up" replace />;
    }

    function handleChange(event) {
        setCnpj(onlyDigits(event.target.value).slice(0, 14));
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!isValidCnpj(cnpj)) {
            setError("CNPJ inválido. Confira os números informados.");
            return;
        }

        setLoading(true);

        try {
            const company = await consultCnpj(cnpj);
            navigate("/auth/register-company/confirm", { state: { company } });
        } catch (err) {
            if (err instanceof SessionExpiredError) {
                navigate("/auth/sign-up", { replace: true });
                return;
            }

            setError(err.message || "Não foi possível consultar o CNPJ. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen flex-col bg-(--surface-page) px-5 py-6 sm:px-8 sm:py-8">
            <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
                <Brand />
                <span className="inline-flex items-center gap-2 rounded-full border border-(--border-default) bg-(--surface-card) px-3 py-1.5 text-xs font-medium text-(--text-secondary)">
                    <LockKeyhole size={13} />
                    Ambiente seguro
                </span>
            </header>

            <section className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-10">
                <Link
                    to="/dashboard"
                    className="mb-7 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--brand-primary)"
                >
                    <ChevronLeft size={16} />
                    Voltar ao painel
                </Link>

                <div className="mb-8">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-(--brand-primary)">
                        Configuração da conta
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-(--text-primary) sm:text-4xl">
                        Vamos cadastrar sua empresa
                    </h1>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-(--text-secondary) sm:text-base">
                        Falta pouco! Informe o CNPJ para buscarmos os dados cadastrais da sua empresa.
                    </p>
                </div>

                <div className="mb-8 rounded-2xl border border-(--border-default) bg-(--surface-card) p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-(--text-primary)">
                            Etapa 2 de 2
                        </span>
                        <span className="text-xs font-medium text-(--text-secondary)">
                            Cadastro da empresa
                        </span>
                    </div>

                    <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-(--surface-soft)">
                        <div className="h-full w-1/2 rounded-full bg-(--brand-primary)" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <ProgressStep
                            number="1"
                            title="Conta criada"
                            description="Concluído"
                            completed
                        />
                        <ProgressStep
                            number="2"
                            title="Sua empresa"
                            description="Etapa atual"
                            active
                        />
                    </div>
                </div>

                <div className="rounded-2xl border border-(--border-default) bg-(--surface-card) p-5 shadow-sm sm:p-7">
                    <div className="mb-6 flex items-start gap-3">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-(--brand-primary-soft) text-(--brand-primary)">
                            <Building2 size={21} />
                        </span>
                        <div>
                            <h2 className="text-base font-semibold text-(--text-primary)">
                                Identificação da empresa
                            </h2>
                            <p className="mt-1 text-sm leading-5 text-(--text-secondary)">
                                Usaremos o CNPJ para consultar os dados cadastrais disponíveis.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <label
                            htmlFor="company-cnpj"
                            className="mb-2 block text-sm font-semibold text-(--text-primary)"
                        >
                            CNPJ
                        </label>
                        <input
                            id="company-cnpj"
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="00.000.000/0000-00"
                            maxLength={18}
                            value={formatCnpj(cnpj)}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? "company-cnpj-error" : "company-cnpj-help"}
                            className="h-12 w-full rounded-xl border border-(--border-default) bg-(--surface-card) px-4 text-base text-(--text-primary) outline-none transition placeholder:text-(--text-muted) focus:border-(--brand-primary) focus:ring-4 focus:ring-(--brand-primary)/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                        {error ? (
                            <p id="company-cnpj-error" role="alert" className="mt-2 text-sm text-(--status-danger)">
                                {error}
                            </p>
                        ) : (
                            <p id="company-cnpj-help" className="mt-2 text-xs leading-5 text-(--text-muted)">
                                Digite os 14 números do CNPJ, com ou sem pontuação.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--brand-primary) px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-(--brand-primary-hover) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-primary)/20 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                                    Consultando CNPJ...
                                </>
                            ) : (
                                <>
                                    Continuar
                                    <ArrowRight size={17} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-(--surface-soft)] p-3.5">
                        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-(--brand-primary)" />
                        <p className="text-xs leading-5 text-(--text-secondary)">
                            Seus dados são utilizados para configurar sua empresa no ConciliaMEI e ficam protegidos.
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-(--text-secondary)">
                    Quer fazer isso depois?{" "}
                    <Link
                        to="/dashboard"
                        className="font-semibold text-(--brand-primary) transition-colors hover:text-(--brand-primary-hover)"
                    >
                        Ir para o painel
                    </Link>
                </p>
            </section>

            <footer className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 border-t border-(--border-default) pt-5 text-xs text-(--text-muted) sm:flex-row">
                <span>ConciliaMEI · Sistema de Conciliação Financeira e Fiscal</span>
                <span>© {new Date().getFullYear()} ConciliaMEI</span>
            </footer>
        </main>
    );
}