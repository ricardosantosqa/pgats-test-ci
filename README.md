<div align="center">

# 🛍️ Usados de Qualidade

**Site estático de vendas com pipeline CI/CD completo via GitHub Actions**

[![Testes Automatizados](https://github.com/SEU_USUARIO/usadosdequalidade/actions/workflows/tests.yml/badge.svg)](https://github.com/SEU_USUARIO/usadosdequalidade/actions/workflows/tests.yml)
[![Deploy GitHub Pages](https://github.com/SEU_USUARIO/usadosdequalidade/actions/workflows/pages.yml/badge.svg)](https://github.com/SEU_USUARIO/usadosdequalidade/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📋 Índice

1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Pipeline CI/CD](#-pipeline-cicd)
   - [Gatilhos de Execução](#gatilhos-de-execução)
   - [Workflow de Testes](#workflow-de-testes-testsyml)
   - [Workflow de Deploy](#workflow-de-deploy-pagesyml)
3. [Relatório de Testes](#-relatório-de-testes)
4. [Conceitos Utilizados](#-conceitos-utilizados)
5. [Estrutura do Projeto](#-estrutura-do-projeto)
6. [Testes Automatizados](#-testes-automatizados)
7. [Como Executar Localmente](#-como-executar-localmente)
8. [Configuração do Repositório](#-configuração-do-repositório)

---

## 🎯 Sobre o Projeto

**Usados de Qualidade** é um site estático de vendas de produtos usados com foco em qualidade. O projeto demonstra a implementação de uma pipeline CI/CD completa utilizando **GitHub Actions**, com:

- ✅ Testes automatizados com Jest
- 📊 Relatório de cobertura de código
- 🚀 Deploy automático para GitHub Pages
- 📅 Execução agendada semanalmente
- 💬 Feedback automático em Pull Requests

---

## ⚙️ Pipeline CI/CD

A pipeline é composta por **dois workflows** independentes que colaboram entre si:

```
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB ACTIONS PIPELINE                  │
│                                                             │
│  Eventos de Trigger                                         │
│  ─────────────────                                          │
│  push/PR ──────┐                                            │
│  schedule ─────┤──▶ tests.yml ──▶ ✅ Testes + Relatório    │
│  manual ───────┘                                            │
│                                                             │
│  push main ───▶ pages.yml ──▶ Test ──▶ Build ──▶ Deploy    │
│  manual ──────▶                                             │
└─────────────────────────────────────────────────────────────┘
```

### Gatilhos de Execução

| Trigger | Workflow | Quando ocorre |
|---------|----------|---------------|
| `push` | `tests.yml` | A cada push nas branches `main` ou `develop` |
| `pull_request` | `tests.yml` | Ao abrir ou atualizar um PR contra `main`/`develop` |
| `workflow_dispatch` | Ambos | Execução manual pelo GitHub UI ou API |
| `schedule` | `tests.yml` | A cada 20 minutos (cron: `*/20 * * * 0`) |
| `push` (main) | `pages.yml` | A cada push aprovado na branch `main` |

---

### Workflow de Testes (`tests.yml`)

Responsável pela **validação contínua** do código. Executa em todas as situações listadas acima.

```yaml
jobs:
  test:
    steps:
      1. Checkout código
      2. Setup Node.js 20 (com cache npm)
      3. npm ci              ← instalação determinística
      4. jest --coverage     ← testes + cobertura + junit.xml
      5. Publicar relatório  ← dorny/test-reporter (aba Checks)
      6. Step Summary        ← tabela de cobertura no resumo da execução
      7. Upload artefatos    ← coverage/ + junit.xml (30 dias)
      8. Comentar no PR      ← feedback automático com link para execução
```

**Diagrama de fluxo:**

```
push / PR / schedule / manual
          │
          ▼
    ┌─────────────┐
    │  Checkout   │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │  Setup Node │
    │  + npm ci   │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │  Jest tests │◀─── jest.config.js
    │  + coverage │     (jsdom, limiares, reporters)
    └──────┬──────┘
           │
     ┌─────┴──────┐
     │            │
  ✅ PASS      ❌ FAIL
     │            │
     ▼            ▼
  Relatório    Relatório
  + Deploy     (sem deploy)
```

---

### Workflow de Deploy (`pages.yml`)

Responsável pela **publicação do site**. Possui três jobs encadeados com `needs:`:

```
push main
    │
    ▼
 [test] ──FAIL──▶ ❌ Pipeline interrompida
    │
  PASS
    │
    ▼
 [build]
    │  python scripts/build_catalog.py
    │  cp -R index.html styles.css app.js catalog.json products logos site/
    ▼
 [deploy]
    │
    ▼
  GitHub Pages 🌐
```

> **Princípio aplicado:** O deploy só acontece após os testes validarem o código. Isso garante que nunca será publicada uma versão com testes falhando.

---

## 📊 Relatório de Testes

A pipeline gera relatórios em três locais diferentes:

### 1. Aba "Checks" (dorny/test-reporter)

O relatório JUnit é publicado diretamente na aba **Checks** do GitHub, exibindo cada teste individualmente com status de passou/falhou, tempo de execução e mensagens de erro.

```
GitHub → repositório → commit → Checks → "Relatório Jest"
```

### 2. Step Summary

Ao final de cada execução, um resumo é gerado na aba da execução com:
- Status geral (✅ / ❌)
- Informações do trigger (branch, commit, runner)
- Tabela de cobertura de código por métrica

### 3. Artefatos (Actions Artifacts)

Os seguintes arquivos ficam disponíveis para download por **30 dias**:

| Artefato | Conteúdo |
|----------|----------|
| `coverage/lcov.info` | Cobertura em formato LCOV (compatível com codecov) |
| `coverage/index.html` | Relatório HTML navegável com detalhes por arquivo |
| `coverage/coverage-summary.json` | Sumário JSON (usado no Step Summary) |
| `junit.xml` | Relatório JUnit XML (usado pelo test-reporter) |

**Como acessar os artefatos:**

```
GitHub → repositório → Actions → execução específica → Artifacts
```

### 4. Comentário automático no PR

Quando o trigger é um Pull Request, a pipeline posta automaticamente um comentário com o resultado:

```markdown
## ✅ Testes Automatizados — PASSOU

| Campo | Valor |
|-------|-------|
| Status  | **PASSOU** |
| Commit  | `abc1234` |
| Execução | [#42](link_para_execucao) |

> Os testes foram executados e **todos passaram**. O relatório de 
> cobertura está disponível nos artefatos da execução.
```

---

## 🧠 Conceitos Utilizados

### GitHub Actions — Conceitos-chave

| Conceito | Onde aparece | Descrição |
|----------|-------------|-----------|
| **Workflow** | `.github/workflows/*.yml` | Arquivo YAML que define toda a automação |
| **Job** | `jobs: test:`, `jobs: build:` | Unidade de trabalho que roda em uma VM isolada |
| **Step** | `steps:` dentro de cada job | Comando ou Action executado sequencialmente |
| **Action** | `uses: actions/checkout@v4` | Bloco de código reutilizável publicado no marketplace |
| **Runner** | `runs-on: ubuntu-latest` | Máquina virtual que executa o job |
| **Trigger** | `on: push / pull_request / schedule / workflow_dispatch` | Evento que dispara o workflow |
| **Artifact** | `upload-artifact@v4` | Arquivo persistido entre execuções para download |
| **Concurrency** | `concurrency: group:` | Evita execuções duplicadas no mesmo branch/PR |
| **Permissions** | `permissions: checks: write` | Controle de acesso mínimo por job |
| **needs** | `needs: test` | Define dependência entre jobs (DAG de execução) |
| **if: always()** | Steps de relatório | Garante execução mesmo se o step anterior falhou |
| **GITHUB_STEP_SUMMARY** | Step de cobertura | Arquivo especial que gera o resumo da execução |
| **context** | `${{ github.sha }}`, `${{ github.event_name }}` | Variáveis de contexto da execução |
| **secrets** | (implícito no GITHUB_TOKEN) | Credenciais injetadas automaticamente |

### Cron Schedule

```
┌───── minuto (0-59)
│ ┌─── hora UTC (0-23)   → 10:00 UTC = 07:00 BRT
│ │ ┌─ dia do mês (1-31)
│ │ │ ┌ mês (1-12)
│ │ │ │ ┌ dia da semana (0=Dom, 1=Seg … 6=Sab)
│ │ │ │ │
0 10 * * 1
```

A pipeline de testes é executada **toda segunda-feira às 07:00 BRT**, garantindo que problemas de degradação (bibliotecas desatualizadas, APIs externas, etc.) sejam detectados mesmo sem commits.

### Jest — Reporters

O projeto usa **dois reporters simultâneos**:

```js
// jest.config.js
reporters: [
  'default',        // saída no terminal (humano)
  ['jest-junit', {  // junit.xml (máquinas / GitHub Actions)
    outputDirectory: '.',
    outputName: 'junit.xml',
  }],
]
```

- **`default`**: Exibe os resultados no terminal durante a execução local e nos logs do Actions.
- **`jest-junit`**: Gera `junit.xml` no formato padrão JUnit, que é lido pelo `dorny/test-reporter` para publicar na aba Checks.

### Cobertura de Código

```
                    ┌─────────────┐
                    │   app.js    │
                    └──────┬──────┘
                           │ instrumentado por Jest
                           ▼
              ┌────────────────────────┐
              │   Tipos de cobertura   │
              ├────────────────────────┤
              │ Statements  – linhas   │
              │ Branches    – if/else  │
              │ Functions   – funções  │
              │ Lines       – linhas   │
              └────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  coverage/  │
                    │  lcov.info  │ ← formato universal
                    │  index.html │ ← relatório visual
                    │  summary    │ ← JSON para pipeline
                    └─────────────┘
```

---

## 📁 Estrutura do Projeto

```
usadosdequalidade/
├── .github/
│   └── workflows/
│       ├── tests.yml       # Pipeline de testes (CI)
│       └── pages.yml       # Pipeline de deploy (CD)
│
├── products/               # Dados de cada produto
│   ├── cadeira-ergonomica-uni/
│   ├── cafeteira-nespresso-essenza-mini/
│   ├── monitor-lg-ultrawide-29/
│   └── tapete-geometrico-sala/
│
├── logos/                  # Assets de imagem
├── scripts/
│   └── build_catalog.py    # Gera catalog.json a partir dos produtos
│
├── app.js                  # Lógica principal do site
├── app.test.js             # Suite de testes Jest
├── catalog.json            # Catálogo de produtos (gerado)
├── index.html              # Página principal
├── styles.css              # Estilos globais
├── jest.config.js          # Configuração Jest + reporters
├── package.json            # Dependências e scripts npm
└── README.md               # Esta documentação
```

---

## 🧪 Testes Automatizados

Os testes cobrem as principais funções de `app.js`:

| Suite | Testes | O que valida |
|-------|--------|-------------|
| `Funções Utilitárias` | 4 | Construção de URLs do WhatsApp, mensagens contextuais |
| `Constantes de Configuração` | 5 | Valores obrigatórios (STORAGE_KEY, SITE_NAME, etc.) |
| `localStorage` | 4 | Persistência de tema (get, set, remove, clear) |
| `Validação de Dados` | 1 | Estrutura obrigatória do objeto produto |
| `Testes de Cobertura` | 8 | Casos-limite, caracteres especiais, múltiplas operações |
| `applyTheme` | 5 | Aplicação de tema dark/light, atualização do DOM |

**Total: 27 testes**

### Executar os testes localmente

```bash
# Testes simples
npm test

# Testes com cobertura
npm run test:coverage

# Modo watch (re-executa ao salvar)
npm run test:watch

# Modo CI (igual ao pipeline: cobertura + junit.xml)
npm run test:ci
```

---

## 🖥️ Como Executar Localmente

### Pré-requisitos

- Node.js ≥ 18
- Python ≥ 3.10
- npm ≥ 9

### Instalação

```bash
# 1. Clone o repositório
https://github.com/ricardosantosqa/pgats-test-ci.git
cd pgats-test-ci

# 2. Instale as dependências
npm install

# 3. Gere o catálogo
npm run build:catalog

# 4. Inicie o servidor local
npm run serve
# → Acesse http://localhost:8000
```

---

## 🔧 Configuração do Repositório

Para que a pipeline funcione corretamente no seu repositório:

### 1. Habilitar GitHub Pages

```
Settings → Pages → Source: "GitHub Actions"
```

### 2. Permissões do Actions

```
Settings → Actions → General → Workflow permissions
→ ✅ "Read and write permissions"
→ ✅ "Allow GitHub Actions to create and approve pull requests"
```

### 3. Verificar a execução

Após o primeiro push:

```
Actions → "🧪 Testes Automatizados" → execução mais recente
```

Você verá:
- ✅ Todos os steps em verde
- 📋 Aba "Checks" com o relatório Jest
- 📁 Seção "Artifacts" com `test-report-N`
- 📊 Step Summary com a tabela de cobertura

---

<div align="center">

**Desenvolvido por Ricardo Santos**  
Projeto de demonstração CI/CD com GitHub Actions

</div>
