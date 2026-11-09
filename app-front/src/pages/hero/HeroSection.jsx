import { Link } from 'react-router-dom';
import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    Check,
    CheckCircle2,
    CircleHelp,
    Clock3,
    FileCheck2,
    FileSpreadsheet,
    FileText,
    GitCompareArrows,
    Mail,
    ScanSearch,
    ShieldCheck,
    Wallet,
    X,
} from 'lucide-react';

const processSteps = [
    {
        number: '01',
        icon: FileText,
        title: 'Conecte suas notas',
        description: 'Importe suas NFS-e e mantenha os documentos do seu negócio reunidos.',
    },
    {
        number: '02',
        icon: GitCompareArrows,
        title: 'Organize os recebimentos',
        description: 'Relacione pagamentos às notas com apoio de valores, datas e informações do Pix.',
    },
    {
        number: '03',
        icon: ScanSearch,
        title: 'Acompanhe o resultado',
        description: 'Veja o que foi conciliado e identifique o que ainda precisa da sua atenção.',
    },
];

const benefits = [
    {
        icon: Clock3,
        title: 'Mais tempo para o negócio',
        description: 'Reduza a conferência repetitiva e concentre sua atenção nas exceções.',
    },
    {
        icon: FileSpreadsheet,
        title: 'Informações organizadas',
        description: 'Consulte notas, pagamentos e comprovantes em um fluxo centralizado.',
    },
    {
        icon: ShieldCheck,
        title: 'Mais clareza e controle',
        description: 'Entenda o status de cada nota e saiba onde existe algo para revisar.',
    },
];

function ProductPreview() {
    return (
        <div className="cm-preview" aria-label="Prévia ilustrativa da conciliação de uma nota fiscal com um recebimento">
            <div className="cm-preview-topbar">
                <div className="cm-window-dots" aria-hidden="true"><i /><i /><i /></div>
                <span>CONCILIAMEI <span className="cm-preview-slash">/</span> CONCILIAÇÃO</span>
                <span className="cm-preview-demo">DEMONSTRAÇÃO</span>
            </div>

            <div className="cm-preview-content">
                <div className="cm-preview-heading">
                    <div>
                        <span className="cm-preview-overline">VISÃO GERAL</span>
                        <h3>Conciliação financeira</h3>
                        <p>Confira notas fiscais e recebimentos em um só lugar.</p>
                    </div>
                    <span className="cm-preview-period">Exemplo ilustrativo <ArrowDownRight size={13} /></span>
                </div>

                <div className="cm-preview-metrics">
                    <div><span>Notas acompanhadas</span><strong>24</strong><small>no período</small></div>
                    <div><span>Conciliadas</span><strong className="cm-metric-green">18</strong><small>pagamento identificado</small></div>
                    <div><span>Precisam de atenção</span><strong>06</strong><small>pendências ou análise</small></div>
                </div>

                <div className="cm-preview-workflow">
                    <div className="cm-preview-workflow-head">
                        <span>EXEMPLO DE CONCILIAÇÃO</span>
                        <span className="cm-preview-status"><CheckCircle2 size={13} /> Correspondência identificada</span>
                    </div>

                    <div className="cm-match-grid">
                        <div className="cm-match-card">
                            <div className="cm-match-icon"><FileText size={17} /></div>
                            <div className="cm-match-label">NOTA FISCAL</div>
                            <strong>NFS-e #001284</strong>
                            <span>Serviço prestado</span>
                            <b>R$ 1.250,00</b>
                        </div>
                        <div className="cm-match-connector" aria-hidden="true">
                            <span className="cm-connector-line" />
                            <span className="cm-connector-icon"><GitCompareArrows size={16} /></span>
                            <small>conferência</small>
                        </div>
                        <div className="cm-match-card">
                            <div className="cm-match-icon cm-match-icon-green"><Wallet size={17} /></div>
                            <div className="cm-match-label">RECEBIMENTO</div>
                            <strong>Pix recebido</strong>
                            <span>Valor identificado</span>
                            <b>R$ 1.250,00</b>
                        </div>
                    </div>

                    <div className="cm-preview-result">
                        <span className="cm-result-check"><Check size={14} /></span>
                        <span><strong>Nota conciliada</strong><small>Valor da nota compatível com o recebimento</small></span>
                        <span className="cm-result-badge">Paga</span>
                    </div>
                </div>
                <div className="cm-preview-footnote"><CircleHelp size={12} /> Interface demonstrativa com dados fictícios.</div>
            </div>
        </div>
    );
}

function BrandMark() {
    return <span className="cm-brand-mark" aria-hidden="true"><i /><i /></span>;
}

export default function HeroSection() {
    return (
        <div className="cm-landing" id="home">
            <header className="cm-header">
                <div className="cm-container cm-header-inner">
                    <Link className="cm-brand" to="/" aria-label="ConciliaMEI - página inicial">
                        <BrandMark />
                        <span className="cm-brand-name">Concilia<span>MEI</span></span>
                    </Link>

                    <nav className="cm-nav" aria-label="Navegação principal">
                        <a href="#home">Home</a>
                        <a href="#sobre">Sobre</a>
                        <a href="#vantagens">Vantagens</a>
                        <a href="#contato">Contato</a>
                    </nav>

                    <Link className="cm-button cm-button-small" to="/auth/signin">
                        Começar agora <ArrowUpRight size={15} />
                    </Link>
                </div>
            </header>

            <main>
                <section className="cm-hero">
                    <div className="cm-grid-texture" aria-hidden="true" />
                    <div className="cm-container cm-hero-layout">
                        <div className="cm-hero-copy">
                            <span className="cm-eyebrow"><i /> CONCILIAÇÃO FISCAL E FINANCEIRA</span>
                            <h1>O controle das suas notas, <em>em perfeita sintonia.</em></h1>
                            <p className="cm-hero-description">
                                O ConciliaMEI aproxima suas notas fiscais de serviço dos recebimentos
                                para você entender o que já foi pago, o que está pendente e o que precisa
                                de uma conferência.
                            </p>
                            <div className="cm-hero-actions">
                                <a className="cm-button cm-button-outline" href="#demonstracao">
                                    Ver demonstração <ArrowDownRight size={16} />
                                </a>
                                <Link className="cm-button cm-button-primary" to="/auth/signin">
                                    Começar agora <ArrowUpRight size={16} />
                                </Link>
                            </div>
                            <div className="cm-hero-note"><CheckCircle2 size={15} /> Mais clareza entre o que você emite e o que recebe.</div>
                        </div>

                        <div className="cm-hero-visual" id="demonstracao">
                            <div className="cm-visual-index"><span>01 / 04</span><span>O sistema em funcionamento</span></div>
                            <ProductPreview />
                            <div className="cm-visual-caption"><span>01</span> Uma visão clara de cada etapa da conciliação.</div>
                        </div>
                    </div>
                    <div className="cm-hero-bottomline" />
                </section>

                <section className="cm-signal-strip" aria-label="Informações acompanhadas pelo ConciliaMEI">
                    <div className="cm-container cm-signal-inner">
                        <p>INFORMAÇÕES QUE TRABALHAM JUNTAS</p>
                        <div className="cm-signal-items">
                            <span><FileText size={17} /> Notas fiscais de serviço</span>
                            <i />
                            <span><Wallet size={17} /> Recebimentos via Pix</span>
                            <i />
                            <span><FileCheck2 size={17} /> Comprovantes</span>
                            <i />
                            <span><GitCompareArrows size={17} /> Conciliação</span>
                        </div>
                    </div>
                </section>

                <section className="cm-about cm-section" id="sobre">
                    <div className="cm-container cm-about-layout">
                        <div className="cm-section-index"><span>01</span><i /> SOBRE O CONCILIAMEI</div>
                        <div className="cm-about-copy">
                            <h2>Menos tempo procurando informações. <em>Mais tempo cuidando do seu negócio.</em></h2>
                            <div className="cm-about-bottom">
                                <p>
                                    Conferir notas fiscais e identificar seus respectivos pagamentos pode
                                    consumir tempo e gerar dúvidas. O ConciliaMEI foi pensado para aproximar
                                    essas informações em um único ambiente, facilitando o acompanhamento
                                    financeiro e fiscal de quem presta serviços.
                                </p>
                                <div className="cm-about-signature"><span className="cm-about-symbol"><GitCompareArrows size={21} /></span><span>Do documento ao recebimento,<br />uma visão mais conectada.</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cm-process cm-section" id="como-funciona">
                    <div className="cm-container">
                        <div className="cm-section-heading">
                            <div className="cm-section-index"><span>02</span><i /> COMO FUNCIONA</div>
                            <h2>Um processo simples.<br /><em>Uma rotina mais organizada.</em></h2>
                            <p>Do registro da nota à conferência do pagamento, acompanhe cada etapa com clareza.</p>
                        </div>

                        <div className="cm-process-grid">
                            {processSteps.map(({ number, icon: Icon, title, description }) => (
                                <article className="cm-process-card" key={number}>
                                    <div className="cm-process-card-top"><span className="cm-line-icon"><Icon size={21} strokeWidth={1.5} /></span><span>{number}</span></div>
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                    <div className="cm-process-card-line" />
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="cm-benefits cm-section" id="vantagens">
                    <div className="cm-container">
                        <div className="cm-benefits-heading">
                            <div>
                                <div className="cm-section-index"><span>03</span><i /> VANTAGENS</div>
                                <h2>Clareza para conferir.<br /><em>Liberdade para avançar.</em></h2>
                            </div>
                            <p>Uma ferramenta para transformar informações dispersas em uma visão mais simples do seu financeiro.</p>
                        </div>

                        <div className="cm-benefits-grid">
                            {benefits.map(({ icon: Icon, title, description }, index) => (
                                <article className="cm-benefit" key={title}>
                                    <span className="cm-benefit-number">0{index + 1}</span>
                                    <Icon size={22} strokeWidth={1.5} />
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="cm-comparison cm-section">
                    <div className="cm-container">
                        <div className="cm-section-heading">
                            <div className="cm-section-index"><span>04</span><i /> UMA NOVA FORMA DE CONFERIR</div>
                            <h2>Troque a conferência dispersa<br /><em>por uma visão conectada.</em></h2>
                        </div>

                        <div className="cm-comparison-grid">
                            <article className="cm-comparison-card cm-old-way">
                                <div className="cm-comparison-label">O JEITO ANTIGO</div>
                                <h3>Informações espalhadas.</h3>
                                <ul>
                                    <li><X size={16} /> Planilhas e anotações separadas</li>
                                    <li><X size={16} /> Conferência manual de cada recebimento</li>
                                    <li><X size={16} /> Dificuldade para localizar divergências</li>
                                    <li><X size={16} /> Pouca visibilidade do que falta receber</li>
                                </ul>
                            </article>
                            <article className="cm-comparison-card cm-new-way">
                                <div className="cm-comparison-label">COM O CONCILIAMEI</div>
                                <h3>Uma visão mais organizada.</h3>
                                <ul>
                                    <li><Check size={16} /> Notas e recebimentos no mesmo ambiente</li>
                                    <li><Check size={16} /> Sugestões para facilitar a conciliação</li>
                                    <li><Check size={16} /> Status para identificar o que exige atenção</li>
                                    <li><Check size={16} /> Acompanhamento de pagamentos parciais e pendentes</li>
                                </ul>
                            </article>
                        </div>
                        <p className="cm-comparison-note">O ConciliaMEI apoia a conferência e a organização; situações que exigem validação continuam sinalizadas para análise.</p>
                    </div>
                </section>

                <section className="cm-contact" id="contato">
                    <div className="cm-grid-texture cm-grid-texture-dark" aria-hidden="true" />
                    <div className="cm-container cm-contact-inner">
                        <div className="cm-section-index"><span>05</span><i /> PRÓXIMO PASSO</div>
                        <h2>Deixe a conciliação<br /><em>mais simples.</em></h2>
                        <p>Tenha suas notas e recebimentos mais próximos, organizados em um só lugar.</p>
                        <Link className="cm-button cm-button-light" to="/auth/signin">Começar agora <ArrowUpRight size={16} /></Link>
                    </div>
                </section>
            </main>

            <footer className="cm-footer">
                <div className="cm-container">
                    <div className="cm-footer-main">
                        <div className="cm-footer-brand">
                            <Link className="cm-brand" to="/"><BrandMark /><span className="cm-brand-name">Concilia<span>MEI</span></span></Link>
                            <p>Conciliação fiscal e financeira<br />com mais clareza para quem empreende.</p>
                        </div>
                        <div className="cm-footer-column">
                            <span>NAVEGAÇÃO</span>
                            <a href="#home">Home</a>
                            <a href="#sobre">Sobre</a>
                            <a href="#vantagens">Vantagens</a>
                            <a href="#contato">Contato</a>
                        </div>
                        <div className="cm-footer-column">
                            <span>ACESSO</span>
                            <Link to="/auth/sign-up">Entrar</Link>
                            <Link to="/auth/signin">Criar conta</Link>
                        </div>
                        <div className="cm-footer-column cm-footer-contact">
                            <span>FALE COM O SISTEMA</span>
                            <p>Precisa acessar sua área ou começar a usar o ConciliaMEI?</p>
                            <Link to="/auth/signin">Acessar o ConciliaMEI <ArrowUpRight size={14} /></Link>
                        </div>
                    </div>
                    <div className="cm-footer-bottom">
                        <span>© {new Date().getFullYear()} ConciliaMEI. Todos os direitos reservados.</span>
                        <span>Feito para simplificar a conciliação.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}