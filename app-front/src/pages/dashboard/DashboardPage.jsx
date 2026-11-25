import { useEffect, useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/context/useAuth";
import { getTransactions } from "@/api/transactionApi";
import {
    FileText,
    Plus,
    TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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

const TABS = [
    ["todas", "Todas"],
    ["income", "Entradas"],
    ["expense", "Saídas"],
];

function formatCurrency(value) {
    if (value == null) return "—";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(value) {
    if (!value) return "—";

    const normalizedDate = value.replace(" ", "T");

    return format(parseISO(normalizedDate), "dd/MM/yyyy", {
        locale: ptBR,
    });
}

function TypeBadge({ type }) {
    const isIncome = type === "income";

    return (
        <Badge variant={isIncome ? "default" : "destructive"}>
            {isIncome ? "Entrada" : "Saída"}
        </Badge>
    );
}

const COLOR_VARIANTS = {
    green: {
        iconWrapper: "bg-emerald-500/15",
        icon: "text-emerald-600",
        value: "text-emerald-600",
    },
    red: {
        iconWrapper: "bg-red-500/15",
        icon: "text-red-600",
        value: "text-red-600",
    },
    blue: {
        iconWrapper: "bg-blue-500/15",
        icon: "text-blue-600",
        value: "text-blue-600",
    },
};

function SummaryCard({ title, value, description, icon: Icon, color = "blue" }) {
    const variant = COLOR_VARIANTS[color] ?? COLOR_VARIANTS.blue;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">{title}</CardTitle>
                <div className={`rounded-md p-1.5 sm:p-2 ${variant.iconWrapper}`}>
                    <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${variant.icon}`} />
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className={`text-lg font-bold tracking-tight sm:text-2xl ${variant.value}`}>{value}</div>
                {description && (
                    <p className="text-[11px] leading-tight text-muted-foreground sm:text-xs">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}

function TransactionMobileCard({ transaction }) {
    const isIncome = transaction.type === "income";

    return (
        <Card className="overflow-hidden">
            <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                            Descrição
                        </p>
                        <p className="truncate text-sm font-semibold">
                            {transaction.description || "Movimentação sem descrição"}
                        </p>
                    </div>

                    <TypeBadge type={transaction.type} />
                </div>

                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                        Contraparte
                    </p>
                    <p className="truncate text-sm font-medium">
                        {transaction.counterpartyName || "Não informada"}
                    </p>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                    <div>
                        <p className="text-[11px] text-muted-foreground">
                            Valor
                        </p>
                        <p className={`text-sm font-semibold ${isIncome ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(transaction.amount)}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-[11px] text-muted-foreground">
                            Data
                        </p>
                        <p className="text-xs">
                            {formatDate(transaction.transactionDate)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function DashboardPage() {
    const { user } = useAuth();
    const userName = user?.name || "usuário";

    const [activeTab, setActiveTab] = useState("todas");
    const [period, setPeriod] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [transactionsError, setTransactionsError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadTransactions() {
            try {
                setTransactionsLoading(true);
                setTransactionsError("");

                const [year, month] = period.split("-");

                const startDate = `${year}-${month}-01`;
                const endDate = new Date(
                    Number(year),
                    Number(month),
                    0
                ).toISOString().slice(0, 10);

                const params = {
                    startDate,
                    endDate,
                    page: 1,
                    limit: 100,
                };

                if (activeTab === "income" || activeTab === "expense") {
                    params.type = activeTab;
                }

                const response = await getTransactions(params);

                if (!active) return;

                const items = response.data.items || [];

                const formattedTransactions = items.map((transaction) => ({
                    id: transaction.id,
                    description: transaction.description || "Movimentação sem descrição",
                    counterpartyName: transaction.counterpartyName,
                    counterpartyTaxId: transaction.counterpartyTaxId,
                    amount: Number(transaction.amount),
                    transactionDate: transaction.transactionDate,
                    type: transaction.type,
                }));

                setTransactions(formattedTransactions);
            } catch (error) {
                if (!active) return;

                setTransactionsError(
                    error.message || "Não foi possível carregar as movimentações."
                );
                setTransactions([]);
            } finally {
                if (active) {
                    setTransactionsLoading(false);
                }
            }
        }

        loadTransactions();

        return () => {
            active = false;
        };
    }, [activeTab, period]);

    const periodLabel = (() => {
        const [year, month] = period.split("-");
        return format(new Date(Number(year), Number(month) - 1, 1), "MMMM/yyyy", { locale: ptBR });
    })();

    const tabCount = (key) => {
        if (key === "todas") return transactions.length;

        return transactions.filter((transaction) => transaction.type === key).length;
    };

    // --- Totais derivados das movimentações ---
    const totalIncome = useMemo(
        () => transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0),
        [transactions]
    );

    const totalExpenses = useMemo(
        () => transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0),
        [transactions]
    );

    const balance = totalIncome - totalExpenses;

    const changePeriod = (event) => setPeriod(event.target.value);

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-6 lg:px-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="min-w-0">
                            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Olá, {userName}</h1>
                            <p className="text-xs text-muted-foreground sm:text-sm">Acompanhe suas movimentações financeiras de {periodLabel}.</p>
                        </div>
                        <Button className="w-full sm:w-auto">
                            <Plus className="h-4 w-4" /> Nova movimentação
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

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Entradas"
                        value={formatCurrency(totalIncome)}
                        icon={TrendingUp}
                        color="green"
                    />

                    <SummaryCard
                        title="Saídas"
                        value={formatCurrency(totalExpenses)}
                        icon={TrendingUp}
                        color="red"
                    />

                    <SummaryCard
                        title="Saldo do período"
                        value={formatCurrency(balance)}
                        icon={TrendingUp}
                        color={balance >= 0 ? "green" : "red"}
                    />

                    <SummaryCard
                        title="Movimentações"
                        value={transactions.length}
                        icon={FileText}
                        color="blue"
                    />
                </section>
                {transactionsError && <p role="alert" className="text-sm text-destructive">{transactionsError}</p>}

                <section>
                    <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">Movimentações recentes</h2>
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

                    <div className="space-y-3 md:hidden">
                        {transactionsLoading ? (
                            <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">Carregando movimentações…</CardContent></Card>
                        ) : transactions.length === 0 ? (
                            <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">Nenhuma movimentação encontrada.</CardContent></Card>
                        ) : transactions.map((transaction) => (
                            <TransactionMobileCard
                                key={transaction.id}
                                transaction={transaction}
                            />
                        ))}
                    </div>

                    <Card className="hidden overflow-hidden md:block">
                        <div className="overflow-x-auto">
                            <Table className="text-sm [&_tr]:h-auto [&_th]:h-9 [&_th]:px-3 [&_th]:py-1.5 [&_td]:px-3 [&_td]:py-1.5">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Contraparte</TableHead>
                                        <TableHead className="w-32">Valor</TableHead>
                                        <TableHead className="w-28">Data</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {transactionsLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-16 text-center text-muted-foreground">
                                                Carregando movimentações…
                                            </TableCell>
                                        </TableRow>
                                    ) : transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-16 text-center text-muted-foreground">
                                                Nenhuma movimentação encontrada.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((transaction) => {
                                            const isIncome = transaction.type === "income";

                                            return (
                                                <TableRow key={transaction.id}>
                                                    <TableCell
                                                        className="max-w-64 truncate font-medium"
                                                        title={transaction.description || "Movimentação sem descrição"}
                                                    >
                                                        {transaction.description || "Movimentação sem descrição"}
                                                    </TableCell>

                                                    <TableCell>
                                                        <TypeBadge type={transaction.type} />
                                                    </TableCell>

                                                    <TableCell className="max-w-48 truncate">
                                                        {transaction.counterpartyName || "Não informada"}
                                                    </TableCell>

                                                    <TableCell className={`whitespace-nowrap font-medium ${isIncome ? "text-green-600" : "text-red-600"}`}>
                                                        {formatCurrency(transaction.amount)}
                                                    </TableCell>

                                                    <TableCell className="whitespace-nowrap text-xs">
                                                        {formatDate(transaction.transactionDate)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
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