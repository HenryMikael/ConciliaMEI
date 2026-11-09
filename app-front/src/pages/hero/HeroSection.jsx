import { Link } from 'react-router-dom';
import {
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    Check,
    FileSpreadsheet,
    FileText,
    GitCompareArrows,
    ScanSearch,
    ShieldCheck,
    Wallet,
} from 'lucide-react';
import DashboardPage from '../dashboard/DashboardPage';
import './HeroSection.css';

const steps = [
    {
        number: '01',
        icon: FileText,
        title: 'Importe suas notas',
        description: 'Reúna as NFS-e emitidas e mantenha os dados fiscais organizados em um só lugar.',
    },
    {
        number: '02',
        icon: GitCompareArrows,
        title: 'Cruze com os recebimentos',
        description: 'O sistema compara os dados da nota com as informações de pagamento, incluindo referências do Pix.',
    },
    {
        number: '03',
        icon: ScanSearch,
        title: 'Saiba o que precisa de atenção',
        description: 'Identifique pagamentos confirmados, valores parciais, pendências e possíveis divergências.',
    },
];

const benefits = [
    {
        icon: FileSpreadsheet,
        title: 'Tudo mais organizado',
        description: 'Notas, pagamentos e comprovantes reunidos para facilitar a consulta.',
    },
    {
        icon: ScanSearch,
        title: 'Menos conferência manual',
        description: 'Encontre correspondências e sugestões sem precisar comparar tudo do zero.',
    },
    {
        icon: ShieldCheck,
        title: 'Mais clareza nas decisões',
        description: 'Visualize o que foi conciliado e o que ainda exige uma verificação.',
    },
];

function scrollToSection(event) {
    const target = document.getElementById(event.currentTarget.hash.slice(1));
    if (!target) return;

    event.preventDefault();
    window.history.pushState(null, '', event.currentTarget.hash);
    target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
}

export default function HeroSection() {
    return (
        <div className="landing-page" id="inicio">
            <header className="landing-nav">
                <div className="landing-container landing-nav-inner">
                    <Link className="landing-brand" to="/" aria-label="ConciliaMEI - início">
                        <span className="landing-brand-mark" aria-hidden="true"><i /><i /></span>
                        <span className="landing-brand-copy">
                            <span className="landing-brand-name">Concilia<span>MEI</span></span>
                            <span className="landing-brand-tag">GESTÃO FISCAL E FINANCEIRA</span>
                        </span>
                    </Link>

                    <nav className="landing-nav-actions" aria-label="Navegação principal">
                        <a href="#como-funciona" onClick={scrollToSection}>Como funciona</a>
                        <a href="#vantagens" onClick={scrollToSection}>Vantagens</a>
                        <Link className="landing-login" to="/auth/sign-up">Entrar</Link>
                        <Link className="landing-button landing-button-primary landing-nav-cta" to="/auth/signin">
                            Criar minha conta <ArrowUpRight size={16} />
                        </Link>
                    </nav>
                </div>
            </header>

            <main>
                <section className="landing-hero" aria-labelledby="landing-title">
                    <div className="landing-container landing-hero-grid">
                        <div className="landing-hero-copy">
                            <div className="landing-eyebrow">
                                <span className="landing-eyebrow-dot" />
                                Conciliação fiscal sem complicação
                            </div>

                            <h1 id="landing-title">
                                Nota emitida. Pagamento recebido.
                                <span> Tudo precisa bater.</span>
                            </h1>

                            <p className="landing-lead">
                                O ConciliaMEI aproxima suas notas fiscais de serviço dos recebimentos
                                para você acompanhar o que já foi pago, o que está pendente e o que
                                merece uma conferência.
                            </p>

                            <div className="landing-hero-actions">
                                <Link className="landing-button landing-button-primary" to="/auth/signin">
                                    Começar agora <ArrowRight size={17} />
                                </Link>
                                <a className="landing-button landing-button-secondary" href="#como-funciona" onClick={scrollToSection}>
                                    Entenda o processo <ArrowDown size={16} />
                                </a>
                            </div>

                            <div className="landing-proof">
                                <span><Check size={15} /> Notas fiscais e recebimentos conectados</span>
                                <span><Check size={15} /> Pendências fáceis de identificar</span>
                            </div>
                        </div>

                        <div className="landing-product" aria-label="Demonstração da área de gestão do ConciliaMEI">
                            <div className="landing-product-glow" />
                            <div className="landing-product-topline">
                                <span className="landing-product-dot" />
                                VISÃO GERAL DO CONCILIAMEI
                                <span className="landing-product-live"><BadgeCheck size={13} /> Painel demonstrativo</span>
                            </div>
                            <div className="landing-dashboard-window">
                                <DashboardPage preview />
                            </div>
                            <div className="landing-float-card">
                                <span className="landing-float-icon"><Wallet size={17} /></span>
                                <span><strong>Conciliação em um só lugar</strong><small>Notas, valores e status em uma visão</small></span>
                                <ArrowUpRight size={16} />
                            </div>
                            <p className="landing-preview-note">Prévia ilustrativa com dados fictícios.</p>
                        </div>
                    </div>
                </section>

                <section className="landing-process" id="como-funciona" aria-labelledby="landing-process-title">
                    <div className="landing-container">
                        <div className="landing-section-heading">
                            <span className="landing-kicker">COMO FUNCIONA</span>
                            <h2 id="landing-process-title">Da nota ao recebimento, <span>com mais clareza.</span></h2>
                            <p>Um fluxo simples para acompanhar suas movimentações sem perder de vista os detalhes.</p>
                        </div>

                        <div className="landing-steps">
                            {steps.map(({ number, icon: Icon, title, description }) => (
                                <article className="landing-step" key={number}>
                                    <div className="landing-step-top">
                                        <span className="landing-step-icon"><Icon size={21} /></span>
                                        <span className="landing-step-number">{number}</span>
                                    </div>
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="landing-benefits" id="vantagens" aria-labelledby="landing-benefits-title">
                    <div className="landing-container">
                        <div className="landing-section-heading landing-section-heading-left">
                            <span className="landing-kicker">POR QUE USAR</span>
                            <h2 id="landing-benefits-title">Mais controle. <span>Menos trabalho manual.</span></h2>
                            <p>Tenha uma visão mais organizada da relação entre o que você emite e o que recebe.</p>
                        </div>

                        <div className="landing-benefit-grid">
                            {benefits.map(({ icon: Icon, title, description }) => (
                                <article className="landing-benefit" key={title}>
                                    <span className="landing-benefit-icon"><Icon size={20} /></span>
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                </article>
                            ))}
                        </div>

                        <div className="landing-status">
                            <div>
                                <span className="landing-kicker">ACOMPANHAMENTO TRANSPARENTE</span>
                                <h3>Você sabe em que pé está cada nota.</h3>
                                <p>Visualize os diferentes cenários e direcione sua atenção para o que realmente precisa ser conferido.</p>
                            </div>
                            <div className="landing-status-list" aria-label="Status de conciliação">
                                <span className="status-paid"><Check size={14} /> Paga</span>
                                <span className="status-pending"><Wallet size={14} /> Pendente</span>
                                <span className="status-partial"><GitCompareArrows size={14} /> Parcialmente paga</span>
                                <span className="status-review"><ScanSearch size={14} /> Em análise</span>
                                <span className="status-error"><ShieldCheck size={14} /> Divergente</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="landing-final-cta">
                    <div className="landing-container landing-final-cta-inner">
                        <div>
                            <span className="landing-kicker">ORGANIZE SUA ROTINA</span>
                            <h2>Suas notas e recebimentos merecem estar em sintonia.</h2>
                            <p>Comece a acompanhar sua conciliação com mais praticidade.</p>
                        </div>
                        <Link className="landing-button landing-button-light" to="/auth/signin">
                            Criar minha conta <ArrowRight size={17} />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="landing-footer">
                <div className="landing-container">
                    <span>© {new Date().getFullYear()} ConciliaMEI</span>
                    <span>Conciliação fiscal e financeira simplificada.</span>
                </div>
            </footer>
        </div>
    );
}
