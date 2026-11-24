# ConciliaMEI — Escopo e especificação do projeto

**Versão:** 2.1 
**Status:** Novo escopo definido; adequação do domínio financeiro em preparação.

---

## 1. Visão geral

O **ConciliaMEI** é uma plataforma web de organização financeira e conciliação bancária destinada a pessoas físicas, MEIs e trabalhadores autônomos.

O sistema permite importar extratos bancários, organizar receitas e despesas, categorizar movimentações e acompanhar a situação financeira do usuário.

Seu principal diferencial é automatizar a organização das movimentações financeiras e permitir a conciliação entre registros manuais e transações identificadas nos extratos bancários.

O projeto não pretende ser um ERP, sistema contábil ou plataforma de gestão fiscal. Seu objetivo é oferecer uma maneira simples de entender, organizar e acompanhar o dinheiro que entra e sai das contas do usuário.

### Objetivos principais

- Centralizar movimentações financeiras.
- Facilitar a importação de extratos bancários.
- Automatizar a categorização de receitas e despesas.
- Identificar movimentações duplicadas.
- Permitir conciliação entre registros manuais e bancários.
- Apresentar indicadores financeiros de maneira clara.

## 2. Público-alvo

- Pessoas físicas que desejam organizar suas finanças.
- MEIs que precisam acompanhar receitas e despesas.
- Trabalhadores autônomos que desejam controlar seus recebimentos e gastos.

O sistema utilizará um usuário como proprietário dos dados financeiros, sem exigir cadastro empresarial, CNPJ ou razão social.

Cada usuário poderá cadastrar uma ou mais contas financeiras.

## 3. Decisões arquiteturais fechadas

| Área | Decisão |
|---|---|
| Público-alvo | Pessoas físicas, MEIs e autônomos |
| Identificação | Usuário autenticado, sem perfil empresarial obrigatório |
| Contas financeiras | Múltiplas contas por usuário |
| Importação bancária | OFX e CSV no MVP |
| Integração bancária | Open Finance em fase futura |
| Movimentações | Importadas e cadastradas manualmente |
| Categorização | Organização automática com possibilidade de correção |
| Conciliação | Organização automática e conciliação manual |
| Documentos fiscais | Fora do escopo do MVP |
| Emissão de notas | Fora do escopo |
| Armazenamento de arquivos | Processamento dos extratos sem necessidade de armazenamento permanente |
| Banco de dados | MySQL |
| Identificadores | UUID em formato String |
| Isolamento | Todos os registros financeiros vinculados ao usuário autenticado |

## 4. Tecnologias

### Backend
- Java 21.
- Spring Boot.
- Spring Data JPA / Hibernate.
- Spring Security.
- JWT.
- MySQL.

### Frontend
- React.
- Vite.
- Tailwind CSS.
- shadcn/ui.

### Infraestrutura atual
- Backend: Render.
- Frontend: Netlify.
- Banco de dados: Aiven.

O Backblaze B2 deixa de ser necessário no MVP, pois não haverá armazenamento de notas fiscais, comprovantes ou documentos financeiros.

## 5. Funcionalidades do sistema

### RF01 — Usuário e autenticação

O sistema utilizará a autenticação existente.

Informações:
- Nome.
- E-mail.
- Senha.

Regras:
- Cada usuário terá acesso somente aos próprios dados financeiros.
- Não será necessário criar um perfil financeiro separado.
- Não será obrigatório informar CPF ou CNPJ.
- As contas, movimentações e categorias estarão vinculadas ao usuário autenticado.

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
- Cadastrar contas.
- Consultar contas.
- Editar informações.
- Desativar contas.
- Consultar saldo calculado.
- Consultar movimentações por conta.

Regras:
- Um usuário poderá possuir várias contas.
- Cada conta pertencerá a um único usuário.
- O saldo será calculado a partir do saldo inicial e das movimentações posteriores à data de referência.
- Desativar uma conta não deverá apagar seu histórico financeiro.

### RF03 — Movimentações financeiras

Permitir registrar, consultar e organizar movimentações financeiras.

Tipos:
- Receita (`INCOME`).
- Despesa (`EXPENSE`).
- Transferência de entrada (`TRANSFER_IN`).
- Transferência de saída (`TRANSFER_OUT`).

Origens:
- Cadastro manual (`MANUAL`).
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
- Identificação da importação, quando aplicável.

Funcionalidades:
- Cadastrar receitas e despesas manualmente.
- Consultar movimentações.
- Editar movimentações.
- Categorizar movimentações.
- Filtrar por período, conta e categoria.
- Identificar possíveis duplicidades.
- Consultar histórico financeiro.

Regras:
- Valores serão armazenados como `BigDecimal`, sempre positivos.
- O tipo determinará se o valor representa entrada ou saída.
- Transferências entre contas próprias não serão consideradas receitas ou despesas.
- Uma transferência será representada por duas movimentações relacionadas.
- Movimentações poderão existir sem conciliação.
- Registros importados deverão preservar a identificação da origem bancária.

### RF04 — Categorias financeiras

Permitir classificar receitas e despesas.

Categorias iniciais sugeridas:

**Despesas**
- Alimentação.
- Transporte.
- Moradia.
- Saúde.
- Educação.
- Lazer.
- Compras.
- Serviços.
- Impostos.
- Outros.

**Receitas**
- Salário.
- Prestação de serviços.
- Vendas.
- Transferências recebidas.
- Outros.

Funcionalidades:
- Disponibilizar categorias padrão.
- Categorizar movimentações.
- Permitir alteração manual da categoria.
- Sugerir categorias com base na descrição da movimentação.
- Permitir personalização futura.

Regras:
- As categorias serão vinculadas ao usuário.
- Cada categoria terá um tipo: receita ou despesa.
- O sistema poderá utilizar regras baseadas em descrições e padrões de movimentações para sugerir categorias.
- O usuário poderá corrigir qualquer classificação automática.

A categorização automática não dependerá obrigatoriamente de inteligência artificial. O MVP poderá utilizar regras e correspondência de palavras-chave.

### RF05 — Importação de extratos bancários

Funcionalidade responsável por receber e processar extratos bancários.

Formatos aceitos:
- OFX.
- CSV.

Funcionalidades:
- Upload de extratos.
- Identificação do formato.
- Leitura e processamento dos registros.
- Pré-visualização das movimentações encontradas.
- Associação com uma conta financeira.
- Identificação de movimentações duplicadas.
- Confirmação da importação.
- Histórico de importações.

Informações extraídas quando disponíveis:
- Data.
- Descrição.
- Valor.
- Tipo de movimentação.
- Identificador bancário.
- Saldo após movimentação, quando disponível.

Regras:
- O sistema deverá validar o formato do arquivo.
- A importação deverá permitir revisão antes da confirmação.
- Registros duplicados não deverão gerar movimentações adicionais.
- O sistema deverá utilizar identificadores bancários quando disponíveis.
- Na ausência de identificadores, deverá utilizar uma impressão digital da movimentação (`import_fingerprint`).
- Arquivos inválidos deverão gerar mensagens compreensíveis.
- A importação deverá preservar a origem bancária dos registros.
- O sistema não deverá solicitar credenciais bancárias.
- O arquivo poderá ser descartado após o processamento, sem armazenamento permanente obrigatório.

**Importante:** os formatos CSV podem variar entre instituições financeiras. O processamento deverá prever a identificação ou configuração do padrão de colunas.

### RF06 — Organização automática das movimentações

Funcionalidade responsável por reduzir o trabalho manual do usuário.

O sistema deverá analisar as movimentações importadas e sugerir classificações.

Critérios:
- Descrição da movimentação.
- Palavras-chave.
- Histórico de classificações do usuário.
- Categoria anteriormente associada a descrições semelhantes.
- Tipo da movimentação.

Funcionalidades:
- Sugerir categorias.
- Aplicar classificações com base em regras configuradas.
- Permitir alteração manual.
- Identificar movimentações sem categoria.
- Permitir criação de regras automáticas futuramente.

Regras:
- A classificação deverá respeitar o tipo da movimentação.
- O usuário poderá corrigir classificações incorretas.
- O sistema deverá permitir identificar movimentações que precisam de revisão.
- A classificação não poderá alterar o valor ou a data original da movimentação.

### RF07 — Conciliação financeira

Funcionalidade responsável por relacionar registros manuais com movimentações identificadas nos extratos bancários.

O objetivo é evitar registros duplicados e permitir que o usuário confira se suas anotações correspondem às movimentações reais da conta.

Critérios para sugestões:
- Valor.
- Data.
- Descrição.
- Conta relacionada.
- Tipo da movimentação.

Status:
- Pendente.
- Sugerida.
- Conciliada.
- Divergente.

Funcionalidades:
- Gerar sugestões de correspondência.
- Confirmar conciliações manualmente.
- Rejeitar sugestões.
- Identificar possíveis registros duplicados.
- Consultar movimentações não conciliadas.
- Desfazer conciliações.
- Consultar histórico de conciliação.

Regras:
- O sistema nunca confirmará uma conciliação sem ação do usuário.
- Uma sugestão não deverá alterar o saldo financeiro.
- Movimentações conciliadas deverão manter o relacionamento entre o registro manual e o registro bancário.
- A mesma movimentação bancária não poderá ser conciliada com vários registros manuais independentes.
- A conciliação não poderá provocar dupla contabilização de valores.
- Registros sem correspondência continuarão válidos.

**Exemplo:**

O usuário registra manualmente uma despesa de R$ 150,00.

Posteriormente, importa um extrato que contém uma saída de R$ 150,00 na mesma conta e em uma data próxima.

O ConciliaMEI identifica a possível correspondência e apresenta uma sugestão.

O usuário poderá confirmar que os dois registros representam a mesma movimentação.

Após a confirmação, os registros serão relacionados, evitando que a despesa seja contabilizada duas vezes.

### RF08 — Dashboard financeiro

Apresentar uma visão geral das finanças do usuário.

Indicadores:
- Saldo total das contas.
- Total de receitas.
- Total de despesas.
- Resultado financeiro do período.
- Evolução financeira mensal.
- Despesas por categoria.
- Receitas por categoria.
- Movimentações recentes.
- Movimentações pendentes de categorização.
- Movimentações pendentes de conciliação.

Filtros:
- Período.
- Conta.
- Categoria.
- Tipo de movimentação.

Regras:
- Todos os indicadores deverão utilizar dados reais do banco.
- Transferências entre contas próprias não deverão distorcer os indicadores de receitas e despesas.
- Movimentações manuais e bancárias conciliadas não poderão ser contabilizadas em duplicidade.
- Os saldos deverão respeitar a data de referência de cada conta.

## 6. Requisitos não funcionais

**RNF01 — Segurança**
- Autenticação JWT.
- Proteção de rotas.
- Validação de propriedade dos registros.
- Isolamento dos dados por usuário.

**RNF02 — Privacidade**
- Usuários não poderão acessar dados financeiros de terceiros.
- Arquivos importados deverão ser processados com segurança.
- Credenciais bancárias nunca deverão ser solicitadas ou armazenadas.
- Dados pessoais e financeiros deverão ter acesso controlado.

**RNF03 — Integridade**
- Operações financeiras críticas deverão utilizar transações do banco.
- Valores monetários deverão utilizar `BigDecimal`.
- Relacionamentos deverão possuir restrições de integridade.
- Conciliações deverão impedir contabilização duplicada.

**RNF04 — Confiabilidade**
- Validar arquivos importados.
- Identificar duplicidades.
- Tratar erros de processamento.
- Evitar importações parciais inconsistentes.
- Preservar a integridade dos registros financeiros.

**RNF05 — Manutenibilidade**
- Separar controllers, services, repositories, entidades e DTOs.
- Manter regras de negócio no backend.
- Separar processadores OFX e CSV.
- Centralizar regras de categorização e conciliação.

**RNF06 — Usabilidade**
- Interface responsiva.
- Indicadores financeiros claros.
- Mensagens de erro compreensíveis.
- Pré-visualização dos extratos.
- Confirmação explícita das operações importantes.

**RNF07 — Auditoria**
- Registrar importações realizadas.
- Registrar confirmações e cancelamentos de conciliação.
- Preservar informações necessárias para rastrear alterações financeiras importantes.

**RNF08 — LGPD**
- Proteger dados pessoais e financeiros.
- Limitar a coleta de informações ao necessário.
- Permitir exclusão e tratamento adequado dos dados do usuário.
- Garantir isolamento entre usuários.

## 7. Modelo de dados

### User

Entidade existente, responsável pela autenticação e propriedade dos dados financeiros.

Relacionamento:
- User 1:N Account.
- User 1:N Category.

### Account

Representa uma conta financeira.

Campos principais:
- `id`
- `user_id`
- `name`
- `bank_name`
- `account_type`
- `initial_balance`
- `balance_date`
- `active`
- `created_at`

Relacionamento: User 1:N Account.

### Category

Representa uma categoria de receita ou despesa.

Campos principais:
- `id`
- `user_id`
- `name`
- `category_type`
- `active`
- `is_default`
- `created_at`

Relacionamento: User 1:N Category.

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

Relacionamento:
- Account 1:N FinancialTransaction.
- Category 1:N FinancialTransaction.

### BankImport

Representa uma importação de extrato bancário.

Campos principais:
- `id`
- `account_id`
- `file_name`
- `file_type`
- `total_transactions`
- `imported_at`
- `status`

Relacionamento: Account 1:N BankImport.

### Reconciliation

Representa a correspondência entre uma movimentação manual e uma movimentação bancária.

Campos principais:
- `id`
- `transaction_id`
- `matched_transaction_id`
- `status`
- `created_at`
- `confirmed_at`

Relacionamento: FinancialTransaction 1:1 FinancialTransaction, por meio de Reconciliation, considerando o registro manual e o registro bancário.

**Observação arquitetural:** o modelo deverá impedir que duas movimentações representando o mesmo evento financeiro sejam contabilizadas simultaneamente. A conciliação deverá manter os dois registros rastreáveis, mas garantir uma única contabilização.

## 8. APIs REST previstas

- `/api/accounts`
- `/api/transactions`
- `/api/categories`
- `/api/imports`
- `/api/reconciliations`
- `/api/dashboard`

Principais operações:

| Método | Endpoint | Objetivo |
|---|---|---|
| GET | `/api/accounts` | Listar contas |
| POST | `/api/accounts` | Cadastrar conta |
| GET | `/api/accounts/{id}` | Consultar conta |
| PUT | `/api/accounts/{id}` | Atualizar conta |
| GET | `/api/transactions` | Listar movimentações |
| POST | `/api/transactions` | Registrar movimentação |
| PUT | `/api/transactions/{id}` | Editar movimentação |
| DELETE | `/api/transactions/{id}` | Excluir movimentação |
| GET | `/api/categories` | Listar categorias |
| POST | `/api/categories` | Criar categoria |
| POST | `/api/imports/ofx` | Importar extrato OFX |
| POST | `/api/imports/csv` | Importar extrato CSV |
| GET | `/api/imports` | Consultar histórico de importações |
| GET | `/api/reconciliations/suggestions` | Consultar sugestões |
| POST | `/api/reconciliations` | Confirmar conciliação |
| DELETE | `/api/reconciliations/{id}` | Desfazer conciliação |
| GET | `/api/dashboard` | Consultar indicadores |

A autorização deverá utilizar o usuário autenticado para identificar a propriedade das contas e movimentações.

O frontend não poderá determinar livremente a qual usuário os registros pertencem.

## 9. Navegação do frontend

A navegação principal deverá conter:

- Dashboard.
- Contas bancárias.
- Movimentações.
- Importar extrato.
- Configurações.

A interface deverá priorizar a simplicidade e facilitar a visualização das informações financeiras.

As opções relacionadas a emissão de notas, cadastro empresarial, documentos fiscais e gestão de empresas deverão ser removidas.

## 10. Integrações futuras

### Open Finance

Não fará parte do MVP.

Em uma etapa futura, o sistema poderá permitir que o usuário autorize a conexão com suas instituições financeiras por meio de um provedor de integração adequado.

Possibilidades:
- Conexão com instituições financeiras.
- Sincronização automática de movimentações.
- Atualização de saldos.
- Importação periódica de transações.
- Redução da necessidade de importações manuais.

Regras:
- A conexão dependerá do consentimento do usuário.
- O sistema não deverá solicitar ou armazenar senhas bancárias.
- A integração deverá respeitar os requisitos de segurança e privacidade aplicáveis.

### Outras expansões possíveis

- Regras personalizadas de categorização.
- Relatórios financeiros avançados.
- Exportação de relatórios.
- Notificações de movimentações.
- Planejamento de orçamento mensal.
- Metas financeiras.
- Inteligência artificial para classificação de despesas.

Essas funcionalidades não fazem parte do MVP.

## 11. Plano de implementação

**Fase 1 — Adequação do domínio**
- Analisar entidades e relacionamentos existentes.
- Remover dependência do perfil empresarial.
- Planejar migração das tabelas antigas.
- Definir o novo relacionamento entre usuário e contas.
- Preservar autenticação e JWT.

**Fase 2 — Contas financeiras**
- Criar entidade Account.
- Implementar repositories.
- Implementar CRUD.
- Vincular contas ao usuário autenticado.
- Implementar cálculo de saldo.

**Fase 3 — Movimentações**
- Criar entidade FinancialTransaction.
- Implementar CRUD.
- Criar categorias padrão.
- Implementar filtros.
- Implementar transferências entre contas.

**Fase 4 — Importação bancária**
- Implementar processador OFX.
- Implementar processador CSV.
- Implementar pré-visualização.
- Identificar duplicidades.
- Implementar confirmação da importação.
- Criar histórico de importações.

**Fase 5 — Organização automática**
- Implementar regras de categorização.
- Criar sugestões de categorias.
- Permitir correção manual.
- Identificar movimentações sem categoria.

**Fase 6 — Conciliação**
- Implementar sugestões de correspondência.
- Permitir confirmação manual.
- Impedir contabilização duplicada.
- Implementar cancelamento de conciliações.
- Registrar histórico.

**Fase 7 — Dashboard**
- Implementar indicadores financeiros.
- Criar gráficos de receitas e despesas.
- Implementar filtros.
- Apresentar movimentações recentes.
- Integrar os dados reais do backend.

**Fase 8 — Finalização**
- Implementar testes automatizados.
- Revisar segurança.
- Validar importações com extratos reais de teste.
- Revisar interface.
- Atualizar README e documentação.
- Preparar apresentação do projeto.

## 12. Diretrizes de desenvolvimento

- Preservar a autenticação e o JWT existentes.
- Manter Java 21 e UUID em String.
- Não apagar tabelas antigas antes de planejar a migração.
- Remover gradualmente as dependências empresariais e fiscais.
- Não misturar regras de negócio com controllers.
- Não confiar em IDs enviados pelo frontend para autorização.
- Garantir isolamento financeiro entre usuários.
- Implementar e testar cada fase antes de avançar.
- Priorizar um MVP funcional.
- Evitar funcionalidades de ERP, contabilidade e emissão fiscal.

---

## 13. Objetivo final do MVP

Permitir que pessoas físicas, MEIs e autônomos organizem suas finanças por meio da importação de extratos bancários, cadastro de movimentações e categorização automática de receitas e despesas.

O sistema deverá identificar possíveis duplicidades, sugerir correspondências entre registros manuais e movimentações bancárias e permitir que o usuário confirme essas conciliações.

O resultado será uma plataforma simples, segura e funcional, que facilite o acompanhamento financeiro sem exigir controles empresariais ou fiscais complexos.

**Proposta central:** importar, organizar, categorizar e conciliar movimentações financeiras em um único lugar.