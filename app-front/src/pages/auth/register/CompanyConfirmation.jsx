import { useState } from "react";
import {
    ArrowRight,
    Building2,
    Check,
    ChevronLeft,
    CircleCheck,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { registerCompany, SessionExpiredError } from "../../../api/companyApi";
import { formatCnpj } from "../../../lib/cnpj";

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
                className={`grid size-9 shrink-0 place-items-center rounded-full border text-sm font-semibold ${
                    completed
                        ? "border-(--brand-primary) bg-(--brand-primary) text-white"
                        : active
                            ? "border-(--brand-primary) bg-(--brand-primary-soft) text-(--brand-primary)"
                            : "border-(--border-default) bg-(--surface-card) text-(--text-muted)"
                }`}
            >
                {completed ? <Check size={17} /> : number}
            </span>
            <span className="min-w-0">
                <span className={`block truncate text-sm font-semibold ${
                    active || completed ? "text-(--text-primary)" : "text-(--text-muted)"
                }`}>
                    {title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-(--text-muted)">
                    {description}
                </span>
            </span>
        </div>
    );
}

export default function CompanyConfirmation() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [registeredCompany, setRegisteredCompany] = useState(null);

    const company = state?.company;

    if (!localStorage.getItem("token")) {
        return <Navigate to="/auth/sign-up" replace />;
    }

    if (!company) {
        return <Navigate to="/auth/register-company" replace />;
    }

    async function handleConfirm() {
        if (saving) return;

        setError("");
        setSaving(true);

        try {
            const savedCompany = await registerCompany(company.cnpj);
            setRegisteredCompany(savedCompany);
        } catch (err) {
            if (err instanceof SessionExpiredError) {
                navigate("/auth/sign-up", { replace: true });
                return;
            }

            setError(err.message || "Não foi possível cadastrar a empresa. Tente novamente.");
        } finally {
            setSaving(false);
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
                {registeredCompany ? (
                    <div className="rounded-2xl border border-(--border-default) bg-(--surface-card) p-6 text-center shadow-sm sm:p-9">
                        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-(--brand-primary-soft) text-(--brand-primary)">
                            <CircleCheck size={29} />
                        </span>
                        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-(--brand-primary)">
                            Cadastro concluído
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-(--text-primary)">
                            Empresa cadastrada!
                        </h1>
                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-(--text-secondary)">
                            {registeredCompany.razaoSocial || "Os dados da sua empresa"} foi vinculada à sua conta. Agora você já pode acessar os recursos do ConciliaMEI.
                        </p>
                        <Link
                            to="/dashboard"
                            className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--brand-primary) px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-(--brand-primary-hover) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-primary)/20"
                        >
                            Ir para o painel
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link
                            to="/auth/register-company"
                            className="mb-7 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--brand-primary)"
                        >
                            <ChevronLeft size={16} />
                            Alterar CNPJ
                        </Link>

                        <div className="mb-8">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-(--brand-primary)">
                                Configuração da conta
                            </p>
                            <h1 className="text-3xl font-bold tracking-tight text-(--text-primary) sm:text-4xl">
                                Confirme os dados da empresa
                            </h1>
                            <p className="mt-3 max-w-lg text-sm leading-6 text-(--text-secondary) sm:text-base">
                                Confira as informações encontradas antes de concluir o cadastro.
                            </p>
                        </div>

                        <div className="mb-8 rounded-2xl border border-(--border-default) bg-(--surface-card) p-5 shadow-sm sm:p-6">
                            <div className="mb-5 flex items-center justify-between gap-3">
                                <span className="text-sm font-semibold text-(--text-primary)">Etapa 2 de 2</span>
                                <span className="text-xs font-medium text-(--text-secondary)">Confirmação</span>
                            </div>
                            <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-(--surface-soft)">
                                <div className="h-full w-full rounded-full bg-(--brand-primary)" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <ProgressStep number="1" title="CNPJ consultado" description="Concluído" completed />
                                <ProgressStep number="2" title="Confirmar dados" description="Etapa atual" active />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-(--border-default) bg-(--surface-card) p-5 shadow-sm sm:p-7">
                            <div className="mb-6 flex items-start gap-3">
                                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-(--brand-primary-soft) text-(--brand-primary)">
                                    <Building2 size={21} />
                                </span>
                                <div>
                                    <h2 className="text-base font-semibold text-(--text-primary)">
                                        Dados cadastrais
                                    </h2>
                                    <p className="mt-1 text-sm leading-5 text-(--text-secondary)">
                                        Essas informações foram obtidas na consulta do CNPJ.
                                    </p>
                                </div>
                            </div>

                            <dl className="divide-y divide-(--border-default) rounded-xl border border-(--border-default)">
                                <div className="p-4">
                                    <dt className="text-xs font-medium text-(--text-muted)">CNPJ</dt>
                                    <dd className="mt-1 text-sm font-semibold text-(--text-primary)">
                                        {formatCnpj(company.cnpj)}
                                    </dd>
                                </div>
                                <div className="p-4">
                                    <dt className="text-xs font-medium text-(--text-muted)">Razão social</dt>
                                    <dd className="mt-1 text-sm font-semibold text-(--text-primary)">
                                        {company.razaoSocial || "Não informado"}
                                    </dd>
                                </div>
                                <div className="p-4">
                                    <dt className="text-xs font-medium text-(--text-muted)">Nome fantasia</dt>
                                    <dd className="mt-1 text-sm text-(--text-primary)">
                                        {company.nomeFantasia || "Não informado"}
                                    </dd>
                                </div>
                                <div className="p-4">
                                    <dt className="text-xs font-medium text-(--text-muted)">Atividade principal</dt>
                                    <dd className="mt-1 text-sm text-(--text-primary)">
                                        {company.atividadePrincipal || "Não informado"}
                                    </dd>
                                </div>
                                <div className="p-4">
                                    <dt className="text-xs font-medium text-(--text-muted)">Situação cadastral</dt>
                                    <dd className="mt-1 text-sm text-(--text-primary)">
                                        {company.situacaoCadastral || "Não informado"}
                                    </dd>
                                </div>
                            </dl>

                            {error && (
                                <p role="alert" className="mt-4 rounded-xl bg-(--status-danger)/10 px-4 py-3 text-sm text-(--status-danger)">
                                    {error}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={saving}
                                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--brand-primary) px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-(--brand-primary-hover) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-primary)/20 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {saving ? (
                                    <>
                                        <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                                        Salvando empresa...
                                    </>
                                ) : (
                                    <>
                                        Confirmar cadastro
                                        <ArrowRight size={17} />
                                    </>
                                )}
                            </button>

                            <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-(--surface-soft) p-3.5">
                                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-(--brand-primary)" />
                                <p className="text-xs leading-5 text-(--text-secondary)">
                                    Ao confirmar, o ConciliaMEI salvará os dados oficiais vinculados à sua conta.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </section>

            <footer className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 border-t border-(--border-default) pt-5 text-xs text-(--text-muted) sm:flex-row">
                <span>ConciliaMEI · Sistema de Conciliação Financeira e Fiscal</span>
                <span>© {new Date().getFullYear()} ConciliaMEI</span>
            </footer>
        </main>
    );
}
