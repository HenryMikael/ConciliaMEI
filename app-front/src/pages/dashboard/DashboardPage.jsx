import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCompany, SessionExpiredError } from "@/api/companyApi";
import {
    getDashboardAttention,
    getDashboardDocuments,
    getDashboardSummary,
} from "@/api/dashboardApi";
import { formatCnpj } from "@/lib/cnpj";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Plus,
    ArrowRight,
    Building2,
    TrendingUp,
    RefreshCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const STATUS_LABELS = {
    paga: "Paga",
    pendente: "Pendente",
    em_analise: "Em análise",
    parcialmente_paga: "Parcialmente paga",
    divergente: "Divergente",
};

const STATUS_VARIANTS = {
    paga: {
        badge: "bg-status-paid/15 text-status-paid border-status-paid/20 hover:bg-status-paid/20",
        icon: <CheckCircle2 className="h-4 w-4 text-status-paid" />,
    },
    pendente: {
        badge: "bg-status-pending/15 text-status-pending border-status-pending/20 hover:bg-status-pending/20",
        icon: <Clock className="h-4 w-4 text-status-pending" />,
    },
    em_analise: {
        badge: "bg-status-analysis/15 text-status-analysis border-status-analysis/20 hover:bg-status-analysis/20",
        icon: <RefreshCcw className="h-4 w-4 text-status-analysis" />,
    },
    parcialmente_paga: {
        badge: "bg-status-partial/15 text-status-partial border-status-partial/20 hover:bg-status-partial/20",
        icon: <TrendingUp className="h-4 w-4 text-status-partial" />,
    },
    divergente: {
        badge: "bg-status-discrepant/15 text-status-discrepant border-status-discrepant/20 hover:bg-status-discrepant/20",
        icon: <AlertTriangle className="h-4 w-4 text-status-discrepant" />,
    },
};

const EMPTY_SUMMARY = {
    totalIssued: null,
    openAmount: null,
    reconciledCount: null,
    pendingActionCount: null,
    counts: {},
};

const TABS = [
    ["todas", "Todas"],
    ["paga", "Pagas"],
    ["pendente", "Pendentes"],
    ["em_analise", "Em análise"],
    ["divergente", "Divergentes"],
];

function formatCurrency(value) {
    if (value == null) return "—";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(value) {
    if (!value) return "—";
    return format(parseISO(value), "dd/MM/yyyy", { locale: ptBR });
}

function StatusBadge({ status }) {
    const config = STATUS_VARIANTS[status];
    if (!config) return <Badge variant="outline">{status || "Sem status"}</Badge>;

    return (
        <Badge variant="outline" className={`${config.badge} gap-0.5 rounded-md px-1.5 py-0 text-[10px]`}>
            <span className="mr-0.5 [&_svg]:h-3 [&_svg]:w-3">{config.icon}</span>
            {STATUS_LABELS[status]}
        </Badge>
    );
}

function SummaryCard({ title, value, description, icon: Icon }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">{title}</CardTitle>
                <div className="rounded-md bg-muted p-1.5 sm:p-2">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="text-lg font-bold tracking-tight sm:text-2xl">{value}</div>
                <p className="text-[11px] leading-tight text-muted-foreground sm:text-xs">{description}</p>
            </CardContent>
        </Card>
    );
}

function NoteMobileCard({ note, onOpen }) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Documento</p>
                        <p className="truncate text-sm font-semibold">{note.number || note.id}</p>
                    </div>
                    <StatusBadge status={note.status} />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium" title={note.client}>{note.client || "Cliente não informado"}</p>
                    <p className="text-[11px] text-muted-foreground">{note.cnpj || "CNPJ não informado"}</p>
                </div>
                {note.pendingReason && (
                    <p className="rounded-md bg-muted/60 p-2 text-xs text-muted-foreground">{note.pendingReason}</p>
                )}
                {note.hasSuggestion && <Badge variant="secondary" className="w-fit">Sugestão de conciliação disponível</Badge>}
                <div className="flex items-center justify-between border-t pt-3">
                    <div>
                        <p className="text-[11px] text-muted-foreground">Valor</p>
                        <p className="text-sm font-semibold">{formatCurrency(note.value)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] text-muted-foreground">Emissão</p>
                        <p className="text-xs">{formatDate(note.issuedAt)}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={() => onOpen(note)}>
                        Abrir <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function DashboardPage() {
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [companyLoading, setCompanyLoading] = useState(true);
    const [companyError, setCompanyError] = useState("");
    const [activeTab, setActiveTab] = useState("todas");
    const [period, setPeriod] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const [summary, setSummary] = useState(EMPTY_SUMMARY);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [summaryError, setSummaryError] = useState("");
    const [notes, setNotes] = useState([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [notesError, setNotesError] = useState("");
    const [attentionNotes, setAttentionNotes] = useState([]);
    const [attentionLoading, setAttentionLoading] = useState(true);
    const [attentionError, setAttentionError] = useState("");

    const userName = localStorage.getItem("name") || "usuário";

    useEffect(() => {
        let active = true;

        async function loadCompany() {
            try {
                const data = await getMyCompany();
                if (!active) return;
                if (!data) {
                    navigate("/auth/register-company", { replace: true });
                    return;
                }
                setCompany(data);
            } catch (error) {
                if (!active) return;
                if (error instanceof SessionExpiredError) {
                    navigate("/auth/sign-up", { replace: true });
                    return;
                }
                setCompanyError(error.message || "Não foi possível carregar a empresa.");
            } finally {
                if (active) setCompanyLoading(false);
            }
        }

        loadCompany();
        return () => { active = false; };
    }, [navigate]);

    useEffect(() => {
        let active = true;
        setSummaryLoading(true);
        setSummaryError("");

        getDashboardSummary(period)
            .then((data) => {
                if (active) setSummary({ ...EMPTY_SUMMARY, ...data, counts: data?.counts || {} });
            })
            .catch((error) => {
                if (error instanceof SessionExpiredError) navigate("/auth/sign-up", { replace: true });
                else if (active) setSummaryError(error.message || "Não foi possível carregar o resumo.");
            })
            .finally(() => {
                if (active) setSummaryLoading(false);
            });

        return () => { active = false; };
    }, [period]);

    useEffect(() => {
        let active = true;
        setNotesLoading(true);
        setNotesError("");

        getDashboardDocuments({ status: activeTab, period, page: 0, size: 8 })
            .then((data) => {
                if (!active) return;
                setNotes(Array.isArray(data) ? data : data?.content || []);
            })
            .catch((error) => {
                if (error instanceof SessionExpiredError) navigate("/auth/sign-up", { replace: true });
                else if (active) setNotesError(error.message || "Não foi possível carregar os documentos.");
            })
            .finally(() => {
                if (active) setNotesLoading(false);
            });

        return () => { active = false; };
    }, [activeTab, period]);

    const loadAttention = useCallback(() => {
        let active = true;
        setAttentionLoading(true);
        setAttentionError("");

        getDashboardAttention()
            .then((data) => {
                if (active) setAttentionNotes(Array.isArray(data) ? data : data?.content || []);
            })
            .catch((error) => {
                if (error instanceof SessionExpiredError) navigate("/auth/sign-up", { replace: true });
                else if (active) setAttentionError(error.message || "Não foi possível carregar as pendências.");
            })
            .finally(() => {
                if (active) setAttentionLoading(false);
            });

        return () => { active = false; };
    }, []);

    useEffect(() => loadAttention(), [loadAttention]);

    const periodLabel = (() => {
        const [year, month] = period.split("-");
        return format(new Date(Number(year), Number(month) - 1, 1), "MMMM/yyyy", { locale: ptBR });
    })();

    const tabCount = (key) => {
        if (key === "todas") return summary.counts?.total ?? summary.totalIssued;
        return summary.counts?.[key] ?? null;
    };

    const openDocument = () => navigate("/notas");
    const changePeriod = (event) => setPeriod(event.target.value);

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-6 lg:px-8">
                    {companyError && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{companyError}</div>}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                                <Building2 className="h-4 w-4 shrink-0" />
                                <span className="truncate">{company?.nomeFantasia || company?.razaoSocial || (companyLoading ? "Carregando empresa..." : "Empresa não identificada")}</span>
                                <span className="hidden text-border sm:inline">•</span>
                                <span className="hidden sm:inline">CNPJ {company?.cnpj ? formatCnpj(company.cnpj) : "—"}</span>
                            </div>
                            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Olá, {userName}</h1>
                            <p className="text-xs text-muted-foreground sm:text-sm">Acompanhe seus documentos e recebimentos de {periodLabel}.</p>
                        </div>
                        <Button className="w-full sm:w-auto" onClick={() => navigate("/notas")}>
                            <Plus className="h-4 w-4" /> Ver documentos
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground">Resumo do período</p>
                    <input
                        aria-label="Período do resumo"
                        type="month"
                        value={period}
                        onChange={changePeriod}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    />
                </div>

                <section className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
                    <SummaryCard title="Documentos" value={summaryLoading ? "…" : summaryError ? "—" : summary.totalIssued ?? "—"} description={`Período de ${periodLabel}`} icon={FileText} />
                    <SummaryCard title="Valor em aberto" value={summaryLoading ? "…" : summaryError ? "—" : formatCurrency(summary.openAmount)} description="Valores ainda não conciliados" icon={AlertCircle} />
                    <SummaryCard title="Conciliados" value={summaryLoading ? "…" : summaryError ? "—" : summary.reconciledCount ?? "—"} description="Confirmações registradas" icon={CheckCircle2} />
                    <SummaryCard title="Pendentes de ação" value={summaryLoading ? "…" : summaryError ? "—" : summary.pendingActionCount ?? "—"} description="Requerem conferência" icon={Clock} />
                </section>
                {summaryError && <p role="alert" className="text-sm text-destructive">{summaryError}</p>}

                <section>
                    <h2 className="mb-3 flex items-center gap-2 text-base font-semibold tracking-tight text-foreground sm:text-lg">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-status-discrepant sm:h-5 sm:w-5" />
                        Pendências que precisam de atenção
                    </h2>
                    {attentionError && <p role="alert" className="mb-3 text-sm text-destructive">{attentionError}</p>}
                    {attentionLoading ? (
                        <p className="text-sm text-muted-foreground">Carregando pendências…</p>
                    ) : attentionNotes.length === 0 ? (
                        <Card><CardContent className="p-5 text-sm text-muted-foreground">Nenhuma pendência retornada pela API.</CardContent></Card>
                    ) : (
                        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {attentionNotes.map((note) => (
                                <Card key={note.id} className="border-l-4 border-l-status-analysis">
                                    <CardHeader className="p-3 pb-2 sm:p-6 sm:pb-2">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <CardTitle className="text-sm sm:text-base">Documento {note.number || note.id}</CardTitle>
                                            <StatusBadge status={note.status} />
                                        </div>
                                        <CardDescription className="truncate text-xs sm:text-sm">{note.client || "Cliente não informado"}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 p-3 pt-0 sm:p-6 sm:pt-0">
                                        <p className="text-xs text-muted-foreground sm:text-sm">{note.pendingReason || "Pendência sem descrição."}</p>
                                        {note.hasSuggestion && <Badge variant="secondary" className="w-fit">Sugestão de conciliação disponível</Badge>}
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-medium">{formatCurrency(note.value)}</span>
                                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-status-analysis" onClick={openDocument}>
                                                Revisar <ArrowRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">Documentos recentes</h2>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0 scrollbar-none [&::-webkit-scrollbar]:hidden">
                                <TabsList className="inline-flex h-8 w-max">
                                    {TABS.map(([key, label]) => (
                                        <TabsTrigger key={key} value={key} className="whitespace-nowrap text-xs">
                                            {label} ({tabCount(key) ?? "—"})
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>
                        </Tabs>
                    </div>

                    {notesError && <p role="alert" className="mb-3 text-sm text-destructive">{notesError}</p>}
                    <div className="space-y-3 md:hidden">
                        {notesLoading ? (
                            <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">Carregando documentos…</CardContent></Card>
                        ) : notes.length === 0 ? (
                            <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">Nenhum documento encontrado.</CardContent></Card>
                        ) : notes.map((note) => <NoteMobileCard key={note.id} note={note} onOpen={openDocument} />)}
                    </div>

                    <Card className="hidden overflow-hidden md:block">
                        <div className="overflow-x-auto">
                            <Table className="text-sm [&_tr]:h-auto [&_th]:h-9 [&_th]:px-3 [&_th]:py-1.5 [&_td]:px-3 [&_td]:py-1.5">
                                <TableHeader><TableRow>
                                    <TableHead className="w-24">Número</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead className="w-32">Valor</TableHead>
                                    <TableHead className="w-28">Emissão</TableHead>
                                    <TableHead className="w-40">Status</TableHead>
                                    <TableHead className="w-10" />
                                </TableRow></TableHeader>
                                <TableBody>
                                    {notesLoading ? (
                                        <TableRow><TableCell colSpan={6} className="h-16 text-center text-muted-foreground">Carregando documentos…</TableCell></TableRow>
                                    ) : notes.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="h-16 text-center text-muted-foreground">Nenhum documento encontrado.</TableCell></TableRow>
                                    ) : notes.map((note) => (
                                        <TableRow key={note.id}>
                                            <TableCell className="whitespace-nowrap font-medium">{note.number || note.id}</TableCell>
                                            <TableCell><div className="flex flex-col leading-tight">
                                                <span className="max-w-60 truncate text-sm" title={note.client}>{note.client || "Cliente não informado"}</span>
                                                <span className="text-[11px] text-muted-foreground">{note.cnpj || "—"}</span>
                                            </div></TableCell>
                                            <TableCell className="whitespace-nowrap">{formatCurrency(note.value)}</TableCell>
                                            <TableCell className="whitespace-nowrap text-xs">{formatDate(note.issuedAt)}</TableCell>
                                            <TableCell><StatusBadge status={note.status} /></TableCell>
                                            <TableCell><Button variant="ghost" size="icon" className="h-7 w-7" onClick={openDocument}>
                                                <ArrowRight className="h-3.5 w-3.5" /><span className="sr-only">Abrir documento {note.number || note.id}</span>
                                            </Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </section>
            </main>
        </div>
    );
}

export default DashboardPage;
