import { useState, useEffect } from "react";
import { Eye, Search, Plus, X, Download, Upload } from "lucide-react";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function NFSe() {
  const [notas, setNotas] = useState([]);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todos os status");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarNotas() {
      try {
        const cnpj = "12345678000199";

        const response = await fetch(
          `http://localhost:8080/api/notas?cnpj=${cnpj}`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar notas");
        }

        const dados = await response.json();

        setNotas(dados.map((nota) => ({
          id: String(nota.numero ?? nota.id ?? ""),
          dataHora: nota.dataEmissao
            ? new Date(nota.dataEmissao).toLocaleString("pt-BR")
            : "-",
          DPS: String(nota.DPS ?? nota.dps ?? "1"),
          tomador: nota.tomador ?? "-",
          cnpj: nota.cnpj ?? nota.cnpjTomador ?? "-",
          valor: Number(nota.valor ?? 0),
          status: nota.status ?? "Pendente",
          statusClass: "bg-amber-100 text-amber-700 border border-amber-200",
        })));
      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar as notas.");
      } finally {
        setCarregando(false);
      }
    }

    buscarNotas();
  }, []);

  const filtrados = notas.filter((nota) => {
    const termo = busca.toLowerCase();

    const correspondeBusca =
      nota.id.toLowerCase().includes(termo) ||
      nota.tomador.toLowerCase().includes(termo) ||
      nota.cnpj.includes(termo);

    const correspondeStatus =
      statusFiltro === "Todos os status" ||
      nota.status === statusFiltro;

    return correspondeBusca && correspondeStatus;
  });

  const total = filtrados.reduce(
    (acc, nota) => acc + nota.valor,
    0
  );

  return (
    <div className="flex-1 bg-[#f3f4f6] p-8">
      <div className="max-w-295 mx-auto">

        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[2.1rem] font-bold tracking-[-0.04em] text-[#1f2937]">
              NFS-e
            </h1>
            <p className="mt-2 text-[1.05rem] text-[#4b5563]">
              Notas fiscais de serviço emitidas e recebidas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl border border-[#d9dfe7] bg-white px-5 py-3 text-sm font-medium text-[#374151] shadow-sm transition hover:bg-[#f9fafb]">
              <Upload className="h-4 w-4" />
              Importar NFS-e
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-[#1f2937] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#111827]">
              <Plus className="h-4 w-4" />
              Emitir NFS-e
            </button>
          </div>
        </div>



        {/* Filtros */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative w-105 max-w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />

            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nº, tomador ou CPF/cnpj"
              className="h-12 w-full rounded-xl border border-[#d9dfe7] bg-white pl-11 pr-10 text-sm text-[#374151] shadow-sm outline-none placeholder:text-[#6b7280] focus:border-[#7aa0ff]"
            />

            {busca && (
              <button
                onClick={() => setBusca("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#6b7280] hover:bg-[#f3f4f6]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <select className="h-12 rounded-xl border border-[#d9dfe7] bg-white px-4 text-sm text-[#374151] shadow-sm outline-none focus:border-[#7aa0ff]">
            <option>Todas as séries</option>
            <option>Série 1</option>
            <option>Série 2</option>
          </select>

          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="h-12 rounded-xl border border-[#d9dfe7] bg-white px-4 text-sm text-[#374151] shadow-sm outline-none focus:border-[#7aa0ff]"
          >
            <option>Todos os status</option>
            <option>Conciliado</option>
            <option>Pendente</option>
            <option>Cancelado</option>
          </select>
        </div>

        {/* Tabela */}
        <div className="mt-8 overflow-hidden rounded-xl border border-[#dfe3ea] bg-white shadow-sm">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-[#f6f7f9] text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[#7a8190]">
              <tr>
                <th className="px-5 py-4">Nº / Data-Hora</th>
                <th className="px-5 py-4">DPS</th>
                <th className="px-5 py-4">Tomador</th>
                <th className="px-5 py-4">Valor</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-[#edf0f3] text-[#111827] transition hover:bg-[#fafbfc]"
                >

                  {/* Número */}
                  <td className="px-5 py-4 align-top">
                    <div className="text-base font-semibold">
                      {item.id}
                    </div>

                    <div className="text-sm text-[#6b7280]">
                      {item.dataHora}
                    </div>
                  </td>

                  {/* DPS */}
                  <td className="px-5 py-4 align-top">
                    <span className="inline-flex rounded-md bg-[#eef2ff] px-2.5 py-1 text-xs font-medium text-[#4338ca]">
                      {item.DPS}
                    </span>
                  </td>

                  {/* Tomador */}
                  <td className="px-5 py-4 align-top">
                    <div className="text-base font-medium">{item.tomador}</div>
                    <div className="text-sm text-[#6b7280]">{item.cnpj}</div>
                  </td>

                  {/* Valor */}
                  <td className="px-5 py-4 align-top">
                    <div className="text-[1.05rem] font-semibold">
                      {currency.format(item.valor)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 align-top">
                    <span
                      className={`inline-flex rounded-md px-3 py-1 text-sm font-medium ${item.statusClass}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center justify-end gap-2">

                      <button
                        title="Visualizar NFS-e"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#dfe3ea] bg-white text-[#4b5563] transition hover:bg-[#f3f4f6]"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        title="Baixar NFS-e"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#dfe3ea] bg-white text-[#4b5563] transition hover:bg-[#f3f4f6]"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {filtrados.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-[#6b7280]"
                  >
                    Nenhuma NFS-e encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé */}
        <div className="mt-6 flex items-center justify-between text-sm text-[#6b7280]">
          <span>
            {filtrados.length} NFS-e
            {filtrados.length !== 1 ? "s" : ""} •{" "}
            {currency.format(total)}
          </span>

          <span>
            Formatos disponíveis: PDF e XML
          </span>
        </div>

      </div>
    </div>
  );
}

export default NFSe;

