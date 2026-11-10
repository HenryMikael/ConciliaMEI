# ConciliaMEI — Escopo e especificação do projeto

**Versão:** 2.0  
**Status:** Escopo do MVP definido; implementação do novo domínio financeiro em preparação.

## 1. Visão geral

O **ConciliaMEI** é uma plataforma web de controle financeiro e conciliação inteligente, destinada a pessoas físicas, MEIs e pequenas empresas.

O sistema permite organizar contas, registrar receitas e despesas, importar movimentações bancárias e armazenar documentos fiscais e comprovantes. Seu principal diferencial é relacionar movimentações financeiras com documentos correspondentes, facilitando a conferência de pagamentos, recebimentos e despesas.

O projeto não pretende ser um ERP completo nem um sistema de emissão de notas fiscais. A emissão continuará sendo realizada por sistemas externos.

## 2. Público-alvo

- Pessoas físicas que desejam organizar suas finanças.
- MEIs que precisam acompanhar receitas e despesas.
- Pequenas empresas que desejam conferir movimentações financeiras e documentos fiscais.

O sistema terá suporte a perfis pessoais e empresariais, mas o MVP utilizará apenas um perfil financeiro por usuário.

## 3. Decisões arquiteturais fechadas

| Área | Decisão |
|---|---|
| Perfis financeiros | Um perfil por usuário no MVP |
| Tipos de perfil | Pessoal e empresarial |
| Importação bancária | OFX e CSV no MVP |
| Integração bancária | Open Finance em fase futura |
| Documentos | XML e PDF desde o MVP |
| Conciliação | Sugestões com confirmação do usuário |
| Emissão de notas | Fora do escopo |
| Armazenamento de arquivos | Backblaze B2 |
| Banco de dados | MySQL |
| Identificadores | UUID em formato String, mantendo o padrão atual do backend |

## 4. Tecnologias

### Backend
- Java 21
- Spring Boot
- Spring Data JPA / Hibernate
- Spring Security
- JWT
- MySQL
- Backblaze B2 para armazenamento de documentos

### Frontend
- React
- Vite
- Tailwind CSS
- shadcn/ui

### Infraestrutura atual
- Backend: Render
- Frontend: Netlify
- Banco de dados: Aiven
- Armazenamento: Backblaze B2

## 5. Funcionalidades do sistema

### RF01 — Perfil financeiro

O usuário terá um perfil financeiro associado à sua conta.

Informações:
- Tipo: pessoal ou empresarial.
- Nome de identificação.
- CPF ou CNPJ, quando aplicável.
- Data de criação.

Regras:
- Cada usuário terá exatamente um perfil no MVP.
- O perfil será criado durante ou após o cadastro do usuário.
- Dados financeiros e documentos deverão estar vinculados ao perfil.
- A arquitetura deverá permitir múltiplos perfis futuramente.

### RF02 — Contas financeiras

Permitir cadastrar e administrar contas utilizadas pelo usuário.

Tipos:
- Conta corrente.
- Conta poupança.
- Carteira digital.
- Dinheiro em espécie.
- Outros.

Informações:
- Nome da conta.
- Banco ou instituição financeira.
- Tipo da conta.
- Saldo inicial.
- Data de referência do saldo.
- Situação: ativa ou inativa.

Funcionalidades:
- Cadastrar, consultar e editar contas.
- Desativar contas.
- Consultar saldo calculado.
- Consultar histórico de movimentações.

O saldo atual será calculado considerando o saldo inicial e as movimentações posteriores à data de referência.

### RF03 — Movimentações financeiras

Permitir registrar e consultar movimentações financeiras.

Tipos:
- Receita (`INCOME`).
- Despesa (`EXPENSE`).
- Transferência de entrada (`TRANSFER_IN`).
- Transferência de saída (`TRANSFER_OUT`).

Origens:
- Manual (`MANUAL`).
- Importação bancária (`BANK_IMPORT`).

Informações:
- Conta relacionada.
- Categoria.
- Descrição.
- Valor.
- Tipo.
- Data da movimentação.
- Origem.
- Identificador externo, quando disponível.

Funcionalidades:
- Cadastrar receitas e despesas manualmente.
- Consultar e editar movimentações.
- Categorizar movimentações.
- Importar extratos OFX e CSV.
- Identificar possíveis movimentações duplicadas.
- Consultar movimentações por período e conta.

Regras:
- Valores serão armazenados como `BigDecimal`, sempre positivos.
- O tipo determina se o valor representa entrada ou saída.
- Transferências entre contas próprias não serão contabilizadas como receitas ou despesas.
- Uma transferência será representada por duas movimentações relacionadas.
- Movimentações poderão existir sem documentos fiscais correspondentes.

### RF04 — Categorias

Permitir classificar receitas e despesas.

Categorias iniciais sugeridas:

**Despesas**
- Alimentação.
- Transporte.
- Moradia.
- Saúde.
- Educação.
- Impostos.
- Outros.

**Receitas**
- Salário.
- Vendas.
- Prestação de serviços.
- Outros.

As categorias serão vinculadas ao perfil financeiro e poderão ser personalizadas futuramente.

### RF05 — Documentos fiscais e comprovantes

Permitir importar, armazenar e consultar documentos financeiros.

Formatos aceitos:
- XML.
- PDF.

Tipos de documentos:
- NF-e.
- NFS-e.
- Comprovantes.
- Outros documentos.

Informações extraídas quando disponíveis:
- Número do documento.
- CPF/CNPJ do emissor.
- CPF/CNPJ do destinatário.
- Valor.
- Data de emissão.
- Tipo do documento.
- Identificação do arquivo.

Funcionalidades:
- Upload de XML e PDF.
- Armazenamento no Backblaze B2.
- Extração de informações dos XMLs.
- Extração de texto de PDFs quando possível.
- Consulta dos documentos importados.
- Identificação de arquivos duplicados.
- Identificação de possíveis documentos fiscais repetidos.

Regras:
- O arquivo original será preservado.
- O banco armazenará a chave do arquivo no B2 e seus metadados.
- Um PDF sem texto extraível continuará disponível para consulta.
- XML de NF-e e XML de NFS-e terão processadores específicos.
- A identificação de arquivos iguais será feita por hash, sem depender exclusivamente dele para identificar notas repetidas.

### RF06 — Conciliação financeira

Funcionalidade central do sistema.

Relacionar movimentações financeiras com documentos fiscais e comprovantes.

Critérios para sugestões:
- Valor.
- Data.
- CPF/CNPJ do emissor ou destinatário.
- Descrição.
- Pagador ou recebedor, quando disponível.

Status:
- Pendente.
- Sugerida.
- Conciliada.
- Parcialmente conciliada.
- Divergente.

Funcionalidades:
- Gerar sugestões de correspondência.
- Confirmar conciliações manualmente.
- Rejeitar sugestões.
- Conciliar pagamentos parciais.
- Relacionar vários pagamentos a um documento.
- Relacionar vários documentos a uma movimentação.
- Consultar divergências.
- Desfazer conciliações.

Regras:
- O sistema nunca confirmará uma conciliação sem ação do usuário.
- Uma sugestão não altera o saldo nem confirma um pagamento.
- A soma dos valores conciliados não poderá ultrapassar o valor disponível da movimentação ou do documento.
- Movimentações sem documentos correspondentes continuarão válidas.
- Os documentos e as movimentações envolvidos deverão pertencer ao mesmo perfil financeiro.

### RF07 — Dashboard

Apresentar uma visão geral das finanças do usuário.

Indicadores:
- Saldo total.
- Receitas.
- Despesas.
- Evolução financeira por período.
- Movimentações recentes.
- Quantidade de documentos conciliados.
- Quantidade de documentos pendentes.
- Possíveis divergências.

Filtros:
- Período.
- Conta.
- Categoria.

Todos os indicadores deverão utilizar dados reais do banco de dados, sem depender de valores mockados.

## 6. Requisitos não funcionais

**RNF01 — Segurança**
- Autenticação JWT.
- Proteção de rotas.
- Validação de propriedade dos dados.
- Isolamento entre perfis financeiros.

**RNF02 — Privacidade**
- Usuários não poderão acessar documentos ou movimentações de outras contas.
- Arquivos armazenados no B2 deverão ter acesso controlado.
- Segredos e credenciais nunca deverão ser enviados ao frontend.

**RNF03 — Integridade**
- Operações financeiras críticas deverão utilizar transações do banco.
- Valores monetários deverão utilizar `BigDecimal`.
- Relacionamentos deverão possuir restrições de integridade.

**RNF04 — Confiabilidade**
- Validar arquivos importados.
- Identificar duplicidades.
- Tratar falhas no processamento de documentos e extratos.

**RNF05 — Manutenibilidade**
- Separar controllers, services, repositories, entidades e DTOs.
- Manter regras de negócio no backend.
- Separar processadores de XML e PDF.

**RNF06 — Usabilidade**
- Interface responsiva.
- Indicadores claros.
- Mensagens de erro compreensíveis.
- Confirmação explícita de operações importantes.

**RNF07 — Auditoria**
- Registrar operações importantes, principalmente confirmações e cancelamentos de conciliação.

**RNF08 — LGPD**
- Proteger dados pessoais e financeiros.
- Controlar acesso e retenção de documentos.
- Permitir tratamento adequado dos dados do usuário.

## 7. Modelo de dados

### User
Entidade existente, responsável pela autenticação.

### FinancialProfile
Representa o perfil financeiro do usuário.

Campos principais:
- `id`
- `user_id`
- `profile_type`
- `display_name`
- `tax_id`
- `created_at`

Relacionamento: User 1:1 FinancialProfile.

### Account
Representa uma conta financeira.

Campos principais:
- `id`
- `profile_id`
- `name`
- `bank_name`
- `account_type`
- `initial_balance`
- `balance_date`
- `active`
- `created_at`

Relacionamento: FinancialProfile 1:N Account.

### Category
Representa uma categoria de receita ou despesa.

Campos principais:
- `id`
- `profile_id`
- `name`
- `category_type`
- `active`
- `is_default`

Relacionamento: FinancialProfile 1:N Category.

### FinancialTransaction
Representa uma movimentação financeira.

Campos principais:
- `id`
- `account_id`
- `category_id`
- `description`
- `amount`
- `transaction_type`
- `transaction_date`
- `source`
- `external_id`
- `import_fingerprint`
- `transfer_group_id`
- `created_at`

Relacionamento: Account 1:N FinancialTransaction.

### FinancialDocument
Representa uma nota fiscal ou comprovante.

Campos principais:
- `id`
- `profile_id`
- `document_type`
- `document_number`
- `issuer_tax_id`
- `recipient_tax_id`
- `amount`
- `issue_date`
- `file_key`
- `file_name`
- `mime_type`
- `file_hash`
- `status`
- `created_at`

Relacionamento: FinancialProfile 1:N FinancialDocument.

### Reconciliation
Representa a relação entre uma movimentação e um documento.

Campos principais:
- `id`
- `transaction_id`
- `document_id`
- `matched_amount`
- `status`
- `matching_method`
- `created_at`

Relacionamento: FinancialTransaction N:N FinancialDocument, através de Reconciliation.

## 8. APIs REST previstas

- `/api/profiles`
- `/api/accounts`
- `/api/categories`
- `/api/transactions`
- `/api/imports`
- `/api/documents`
- `/api/reconciliations`
- `/api/dashboard`

Principais operações:

| Método | Endpoint | Objetivo |
|---|---|---|
| GET | `/api/profiles/me` | Consultar perfil |
| PUT | `/api/profiles/me` | Atualizar perfil |
| POST | `/api/accounts` | Cadastrar conta |
| GET | `/api/accounts` | Listar contas |
| POST | `/api/transactions` | Registrar movimentação |
| GET | `/api/transactions` | Listar movimentações |
| POST | `/api/imports/bank-statement` | Importar OFX/CSV |
| POST | `/api/documents` | Importar XML/PDF |
| GET | `/api/documents` | Listar documentos |
| GET | `/api/reconciliations/suggestions` | Consultar sugestões |
| POST | `/api/reconciliations` | Confirmar conciliação |
| DELETE | `/api/reconciliations/{id}` | Desfazer conciliação |
| GET | `/api/dashboard` | Consultar indicadores |

A autorização deverá utilizar o usuário autenticado para resolver o perfil financeiro. O frontend não poderá determinar livremente a qual usuário ou perfil os registros pertencem.

## 9. Navegação do frontend

- Dashboard.
- Contas.
- Movimentações.
- Documentos.
- Conciliação.
- Configurações.

A opção de emissão de notas fiscais deverá ser removida da navegação.

## 10. Integrações futuras

### Open Finance

Não fará parte do MVP.

Em uma etapa futura, poderá permitir a conexão com instituições financeiras por meio de um provedor autorizado, mediante consentimento do usuário.

O sistema não deverá solicitar ou armazenar senhas bancárias.

### Expansões possíveis
- Múltiplos perfis financeiros por usuário.
- Relatórios financeiros avançados.
- Categorias personalizadas e regras automáticas.
- Notificações de movimentações.
- Integrações bancárias automáticas.

## 11. Plano de implementação

**Fase 1 — Fundação do domínio**
- Criar entidades financeiras.
- Definir relacionamentos JPA.
- Criar repositories.
- Configurar integridade do banco.
- Planejar migração dos dados legados.

**Fase 2 — Perfil e contas**
- Criar perfil financeiro.
- Vincular perfil ao cadastro de usuário.
- Implementar CRUD de contas.
- Implementar categorias padrão.

**Fase 3 — Movimentações**
- CRUD de movimentações.
- Cálculo de saldo.
- Transferências entre contas.
- Filtros e consultas.

**Fase 4 — Importação bancária**
- Upload OFX/CSV.
- Leitura dos arquivos.
- Pré-visualização.
- Detecção de duplicidades.
- Confirmação da importação.

**Fase 5 — Documentos**
- Upload XML/PDF.
- Armazenamento B2.
- Extração de dados.
- Identificação de duplicidades.

**Fase 6 — Conciliação**
- Motor de sugestões.
- Confirmação manual.
- Pagamentos parciais.
- Divergências.
- Desfazer conciliação.

**Fase 7 — Dashboard**
- Indicadores reais.
- Gráficos.
- Filtros.
- Histórico financeiro.

**Fase 8 — Evolução**
- Open Finance.
- Múltiplos perfis.
- Novas integrações.

## 12. Diretrizes de desenvolvimento

- Preservar a autenticação e o JWT existentes.
- Manter Java 21 e o padrão UUID em String.
- Não apagar entidades e tabelas antigas antes de planejar a migração.
- Não misturar regras de negócio com controllers.
- Não confiar em IDs enviados pelo frontend para autorização.
- Implementar e testar cada fase antes de avançar.
- Priorizar um MVP funcional, sem adicionar funcionalidades de ERP que não fazem parte da proposta.

**Objetivo do MVP:** permitir que um usuário organize suas contas, registre ou importe movimentações, importe documentos fiscais e comprovantes e confirme manualmente as correspondências sugeridas pelo sistema.