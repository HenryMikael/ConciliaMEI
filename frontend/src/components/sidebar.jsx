
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  RefreshCcw,
  ClipboardCheck,
  Settings,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";

const groups = [
  {
    label: null,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "GESTÃO FINANCEIRA",
    items: [
      {
        title: "Notas Fiscais",
        url: "/notas",
        icon: FileText,
      },
      {
        title: "Conciliação",
        url: "/conciliacao",
        icon: RefreshCcw,
      },
      {
        title: "Pagamentos",
        url: "/pagamentos",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    label: "SISTEMA",
    items: [
      {
        title: "Configurações",
        url: "/configuracoes",
        icon: Settings,
      },
    ],
  },
];

export function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r bg-card",
        "transition-[width] duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Cabeçalho */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center gap-2 overflow-hidden border-b",
          collapsed ? "justify-center px-2" : "px-4"
        )}
      >
        <div className="shrink-0 rounded-md bg-primary p-1.5">
          <Building2 className="h-4 w-4 text-primary-foreground" />
        </div>

        <span
          className={cn(
            "overflow-hidden whitespace-nowrap text-sm font-semibold text-foreground",
            "transition-[opacity,width] duration-200 ease-in-out",
            collapsed ? "w-0 opacity-0" : "w-48 opacity-100"
          )}
        >
          Conciliação Fiscal
        </span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-4 overflow-x-hidden overflow-y-auto p-2">
        {groups.map((group) => (
          <div
            key={group.label ?? "overview"}
            className="space-y-1"
          >
            {group.label && (
              <p
                className={cn(
                  "overflow-hidden whitespace-nowrap px-3 text-[10px] font-semibold tracking-wider text-muted-foreground/70",
                  "transition-[max-height,opacity] duration-200 ease-in-out",
                  collapsed
                    ? "max-h-0 opacity-0"
                    : "max-h-6 pb-1 pt-2 opacity-100"
                )}
              >
                {group.label}
              </p>
            )}

            {group.items.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end={item.url === "/"}
                title={collapsed ? item.title : undefined}
                className={({ isActive }) =>
                  cn(
                    "flex h-10 w-full shrink-0 items-center gap-3 overflow-hidden rounded-md px-3 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-0",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />

                <span
                  className={cn(
                    "overflow-hidden whitespace-nowrap",
                    "transition-[opacity,width] duration-200 ease-in-out",
                    collapsed
                      ? "w-0 opacity-0"
                      : "w-40 opacity-100"
                  )}
                >
                  {item.title}
                </span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Botão de recolher */}
      <div className="shrink-0 border-t p-2">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "flex h-10 w-full shrink-0 items-center gap-3 overflow-hidden rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4 shrink-0" />
          ) : (
            <PanelLeftClose className="h-4 w-4 shrink-0" />
          )}

          <span
            className={cn(
              "overflow-hidden whitespace-nowrap",
              "transition-[opacity,width] duration-200 ease-in-out",
              collapsed
                ? "w-0 opacity-0"
                : "w-20 opacity-100"
            )}
          >
            Recolher
          </span>
        </button>
      </div>
    </aside>
  );
}
