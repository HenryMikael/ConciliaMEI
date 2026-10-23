import React, { useState } from "react";
import { Download, Eye, FileText, Paperclip, Search, X } from "lucide-react";

const pagamentos = [
  {
    id: "000125",
    dataHora: "26/08/2026 10:52",
    tipo: "PIX",
    tomador: "Galvão Amorim Construção e Iincorporação Ltda.",
    cnpj: "09.170.007/0001-26",
    valor: 2300,
    status: "Pendente",
    statusClass: "bg-amber-100 text-amber-700 border border-amber-200",
    anexo: null
  },
  {
    id: "000124",
    dataHora: "24/08/2026 14:32",
    tipo: "PIX",
    tomador: "Construtora Horizonte S.A.",
    cnpj: "98.765.432/0001-10",
    valor: 3200,
    status: "Conciliado",
    statusClass: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    anexo: "PDF",
  },
  {
    id: "000123",
    dataHora: "23/08/2026 09:15",
    tipo: "TED",
    tomador: "Consultoria ABC ME",
    cnpj: "11.222.333/0001-44",
    valor: 1500,
    status: "Conciliado",
    statusClass: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    anexo: "PDF",
  },
  {
    id: "000122",
    dataHora: "22/08/2026 16:48",
    tipo: "Boleto",
    tomador: "Auto Peças Sul",
    cnpj: "33.444.555/0001-66",
    valor: 875.5,
    status: "Pendente",
    statusClass: "bg-amber-100 text-amber-700 border border-amber-200",
    anexo: null,
  },
  {
    id: "000121",
    dataHora: "20/08/2026 11:02",
    tipo: "PIX",
    tomador: "Distribuidora Norte",
    cnpj: "55.666.777/0001-88",
    valor: 4200,
    status: "Pendente",
    statusClass: "bg-amber-100 text-amber-700 border border-amber-200",
    anexo: null,
  },
  {
    id: "000119",
    dataHora: "18/08/2026 08:47",
    tipo: "TED",
    tomador: "Logística Rápida Ltda.",
    cnpj: "99.000.111/0001-33",
    valor: 2850,
    status: "Conciliado",
    statusClass: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    anexo: "PDF",
  },
  {
    id: "000118",
    dataHora: "17/08/2026 15:20",
    tipo: "Cartão",
    tomador: "Gráfica Express",
    cnpj: "22.333.444/0001-55",
    valor: 950,
    status: "Cancelado",
    statusClass: "bg-rose-100 text-rose-700 border border-rose-200",
    anexo: "XML",
  },
];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function Pagamentos() {
  const [busca, setBusca] = useState("");

  const filtrados = pagamentos.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      c.id.toLowerCase().includes(termo) ||
      c.tomador.toLowerCase().includes(termo) ||
      c.cnpj.includes(termo)
    );
  });

  const total = filtrados.reduce((acc, c) => acc + c.valor, 0);

  return (
    <div className="flex-1 bg-[#f3f4f6] p-8">
      <div className="max-w-295 mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[2.1rem] font-bold tracking-[-0.04em] text-[#1f2937]">
              Pagamentos
            </h1>
            <p className="mt-2 text-[1.05rem] text-[#4b5563]">
              Registro manual de comprovantes de pagamento e recebimento
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-[#1f2937] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#111827]">
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
        </div>

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
            <option>Todos os tipos</option>
            <option>PIX</option>
            <option>TED</option>
            <option>Boleto</option>
            <option>Cartão</option>
          </select>

          <select className="h-12 rounded-xl border border-[#d9dfe7] bg-white px-4 text-sm text-[#374151] shadow-sm outline-none focus:border-[#7aa0ff]">
            <option>Todos os status</option>
            <option>Conciliado</option>
            <option>Pendente</option>
            <option>Cancelado</option>
          </select>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-[#dfe3ea] bg-white shadow-sm">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-[#f6f7f9] text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[#7a8190]">
              <tr>
                <th className="px-5 py-4">Nº / Data-Hora</th>
                <th className="px-5 py-4">Tipo</th>
                <th className="px-5 py-4">Tomador</th>
                <th className="px-5 py-4">Valor</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Anexo</th>
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

                  {/* Tipo */}
                  <td className="px-5 py-4 align-top">
                    <span className="inline-flex rounded-md bg-[#eef2ff] px-2.5 py-1 text-xs font-medium text-[#4338ca]">
                      {item.tipo}
                    </span>
                  </td>

                  {/* Tomador + cnpj na mesma célula */}
                  <td className="px-5 py-4 align-top">
                    <div className="text-base font-medium">{item.tomador}</div>
                    <div className="text-sm text-[#6b7280]">{item.cnpj}</div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="text-[1.05rem] font-semibold">
                      {currency.format(item.valor)}
                    </div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <span
                      className={`inline-flex rounded-md px-3 py-1 text-sm font-medium ${item.statusClass}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 align-top">
                    {item.anexo ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-[#4b5563]">
                        <FileText className="h-4 w-4" />
                        {item.anexo}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm text-[#9ca3af] italic">
                        Sem anexo
                      </span>
                    )}
                  </td>
                    {/* Botões de ação */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="Anexar"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#dfe3ea] bg-white text-[#4b5563] transition hover:bg-[#f3f4f6]"
                      >
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <button
                        title="Visualizar"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#dfe3ea] bg-white text-[#4b5563] transition hover:bg-[#f3f4f6]"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        title="Baixar"
                        disabled={!item.anexo}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#dfe3ea] bg-white text-[#4b5563] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Nenhum comprovante encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-[#6b7280]">
          <span>
            {filtrados.length} comprovante{filtrados.length !== 1 ? "s" : ""} •{" "}
            {currency.format(total)}
          </span>
          <span>Formatos disponíveis: PDF e PNG</span>
        </div>
      </div>
    </div>
  );
}

export default Pagamentos;