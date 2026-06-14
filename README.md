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
8. [Correções Aplicadas (Troubleshooting)](#-correções-aplicadas-troubleshooting)
9. [Configuração do Repositório](#-configuração-do-repositório)

---

## 🎯 Sobre o Projeto

**Usados de Qualidade** é um site estático de vendas de produtos usados com foco em qualidade. O projeto demonstra a implementação de uma pipeline CI/CD completa utilizando **GitHub Actions**, com:

- ✅ Testes automatizados com Jest
- 📊 Relatório de cobertura de código
- 🚀 Deploy automático para GitHub Pages
- 📅 Execução agendada todos os dias a cada 30 minutos
- 📧 Notificação por email ao final da execução
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
| `schedule` | `tests.yml` | Todos os dias a cada 30 minutos (cron: `*/30 * * * *`) |
| `push` (main) | `pages.yml` | A cada push aprovado na branch `main` |

> ⚠️ **Atenção ao consumo de minutos:** o agendamento `*/30 * * * *` executa o
> workflow **48 vezes por dia**. Em repositórios privados isso consome a cota
> gratuita de minutos do GitHub Actions rapidamente. Em repositórios públicos
> o uso é ilimitado, mas considere aumentar o intervalo (ex.: `*/60 * * * *`)
> em projetos reais.

---

### Workflow de Testes (`tests.yml`)

Responsável pela **validação contínua** do código. Executa em todas as situações listadas acima.

```yaml
jobs:
  test:
    steps:
      1. Checkout código              ← actions/checkout@v6
      2. Setup Node.js 24 (cache npm) ← actions/setup-node@v6
      3. npm install                  ← instala dependências e ajusta o lockfile
      4. jest --coverage              ← testes + cobertura + junit.xml (continue-on-error)
      5. Publicar relatório           ← dorny/test-reporter@v3 (aba Checks)
      6. Step Summary                 ← tabela de cobertura no resumo da execução
      7. Upload artefatos             ← coverage/ + junit.xml (30 dias)
      8. Comentar no PR               ← feedback automático com link para execução
      9. Enviar email                 ← notificação opcional por SMTP
      10. Resultado final             ← falha o job se os testes não passaram
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
    ┌──────▼────────┐
    │  Setup Node   │
    │  + npm install│
    └──────┬────────┘
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
  + job OK     + job falha
  (step 9)     (step 9)
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
    │  python3 scripts/build_catalog.py
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

A pipeline gera relatórios e notificações em cinco canais:

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

### 5. Notificação por email

A workflow também tenta enviar um email ao final da execução, com status, branch, commit e link direto para o relatório da execução.

O GitHub Actions não expõe o email privado da conta do repositório por segurança. Para usar o email da própria conta, cadastre esse endereço no secret `NOTIFICATION_EMAIL`.

Secrets necessários em `Settings → Secrets and variables → Actions`:

| Secret | Valor |
|--------|-------|
| `SMTP_HOST` | Servidor SMTP, ex.: `smtp.gmail.com` |
| `SMTP_PORT` | Porta SMTP, normalmente `587` ou `465` |
| `SMTP_USERNAME` | Usuário/email usado para autenticar no SMTP |
| `SMTP_PASSWORD` | Senha ou app password do provedor de email |
| `NOTIFICATION_EMAIL` | Email que receberá a notificação |
| `NOTIFICATION_FROM` | Remetente opcional; se vazio, usa `SMTP_USERNAME` |

Se esses secrets não estiverem configurados, a etapa de email é ignorada sem quebrar a pipeline.

---

## 🧠 Conceitos Utilizados

### GitHub Actions — Conceitos-chave

| Conceito | Onde aparece | Descrição |
|----------|-------------|-----------|
| **Workflow** | `.github/workflows/*.yml` | Arquivo YAML que define toda a automação |
| **Job** | `jobs: test:`, `jobs: build:` | Unidade de trabalho que roda em uma VM isolada |
| **Step** | `steps:` dentro de cada job | Comando ou Action executado sequencialmente |
| **Action** | `uses: actions/checkout@v6` | Bloco de código reutilizável publicado no marketplace |
| **Runner** | `runs-on: ubuntu-latest` | Máquina virtual que executa o job |
| **Trigger** | `on: push / pull_request / schedule / workflow_dispatch` | Evento que dispara o workflow |
| **Artifact** | `upload-artifact@v6` | Arquivo persistido entre execuções para download |
| **Concurrency** | `concurrency: group:` | Evita execuções duplicadas no mesmo branch/PR |
| **Permissions** | `permissions: checks: write` | Controle de acesso mínimo por job |
| **needs** | `needs: test` | Define dependência entre jobs (DAG de execução) |
| **if: always()** | Steps de relatório | Garante execução mesmo se o step anterior falhou |
| **continue-on-error** | Step de testes | Permite que o job continue para gerar/publicar o relatório mesmo se os testes falharem |
| **GITHUB_STEP_SUMMARY** | Step de cobertura | Arquivo especial que gera o resumo da execução |
| **context** | `${{ github.sha }}`, `${{ github.event_name }}` | Variáveis de contexto da execução |
| **secrets** | (implícito no GITHUB_TOKEN) | Credenciais injetadas automaticamente |

### Cron Schedule

```
┌───── minuto (0-59)
│ ┌─── hora (0-23)
│ │ ┌─ dia do mês (1-31)
│ │ │ ┌ mês (1-12)
│ │ │ │ ┌ dia da semana (0=Dom … 6=Sab)
│ │ │ │ │
*/30 * * * *
```

`*/30 * * * *` significa **"a cada 30 minutos, todos os dias"** — o workflow
`tests.yml` é disparado automaticamente nos minutos `00` e `30` de cada
hora, garantindo que problemas de degradação (dependências desatualizadas,
APIs externas, regressões silenciosas) sejam detectados mesmo sem novos
commits.

> 📌 Horários de `schedule` no GitHub Actions são sempre em **UTC** e podem
> sofrer atraso em períodos de alta demanda da plataforma — o agendamento é
> uma garantia de "no mínimo a cada X minutos", não uma garantia exata.

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
├── test/                   # Testes automatizados
│   └── app.test.js         # Suite de testes Jest
│
├── app.js                  # Lógica principal do site
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
| `getCatalogPath` | 2 | Caminho do catálogo conforme a página |
| `applyTheme` | 5 | Aplicação de tema dark/light, atualização do DOM |

**Total: 29 testes**

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

- Node.js ≥ 20 (recomendado: 24, mesma versão usada na pipeline)
- npm ≥ 9
- Python ≥ 3.10 (apenas para gerar o catálogo de produtos)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/ricardosantosqa/pgats-test-ci.git
cd pgats-test-ci

# 2. Instale as dependências
npm install

# 3. Gere o catálogo
npm run build:catalog

# 4. Inicie o servidor local
npm run serve
# → Acesse http://localhost:8000
```

### Rodando os testes

Veja a seção [🧪 Testes Automatizados](#-testes-automatizados) para todos os
comandos de teste (`npm test`, `npm run test:coverage`, `npm run test:watch`,
`npm run test:ci`). O comando `npm run test:ci` reproduz exatamente o que a
pipeline executa, gerando `coverage/` e `junit.xml` na raiz do projeto.

---

## 🛠️ Correções Aplicadas (Troubleshooting)

Esta seção documenta os problemas encontrados na pipeline original e as
correções aplicadas — útil tanto para entender as mudanças quanto como
referência caso problemas semelhantes apareçam no futuro.

### 1. `npm ci` falhava com exit code 1 (causa raiz)

O `package-lock.json` estava **fora de sincronia** com o `package.json`: a
dependência `jest-junit` (usada para gerar o `junit.xml`) constava em
`package.json`, mas não havia sido registrada no lockfile. Como `npm ci`
exige sincronia exata entre os dois arquivos, a instalação falhava
imediatamente — e, sem dependências instaladas, `npm test` nunca chegava a
rodar. Isso explica os erros:

- `Process completed with exit code 1` (no step de instalação/testes)
- `No test report files were found` / `No file matches path junit.xml`
- `No files were found with the provided path: coverage/ junit.xml`

**Correção:** o step de instalação passou a usar `npm install`, que resolve
e atualiza o lockfile automaticamente em vez de falhar por divergência.
Recomenda-se rodar `npm install` localmente e commitar o `package-lock.json`
atualizado assim que possível, para voltar a usar `npm ci` (mais
determinístico) no futuro.

### 2. Avisos de depreciação do Node.js 20

As actions `actions/checkout@v4`, `actions/setup-node@v4`,
`actions/upload-artifact@v4.6.2` e `dorny/test-reporter@v1.9.1` ainda
executavam em Node.js 20, runtime que está sendo descontinuado pelo GitHub
Actions (Node 24 torna-se padrão e Node 20 é removido em set/2026).

**Correção:** todas as actions foram atualizadas para as versões mais
recentes, compatíveis com Node 24:

| Action | Antes | Depois |
|--------|-------|--------|
| `actions/checkout` | `v4` / `v4.2.2` | `v6` |
| `actions/setup-node` | `v4` / `v4.4.0` | `v6` |
| `actions/upload-artifact` | `v4.6.2` | `v6` |
| `actions/setup-python` | `v5` | `v6` |
| `dorny/test-reporter` | `v1.9.1` | `v3` |

### 3. `pages.yml` rodando testes em Node 20 com flags inválidas

O job `test` do `pages.yml` usava Node 20 e a flag `--forceExit`, que
mascarava problemas em vez de resolvê-los e ainda gerava o aviso de
depreciação.

**Correção:** o job agora usa Node 24 e `npm test -- --passWithNoTests`,
consistente com o `tests.yml`.

### 4. Job falhava "cedo demais", sem publicar relatório

Antes, se `jest` retornasse código de saída diferente de zero, o job parava
imediatamente e os steps seguintes (publicar relatório, gerar resumo, subir
artefatos, comentar no PR) eram pulados — por isso o relatório nunca era
encontrado mesmo quando os testes chegavam a rodar.

**Correção:** o step de testes agora usa `continue-on-error: true` e seu
resultado é armazenado em `steps.run_tests.outcome`. Um novo step final
("🚦 Resultado final dos testes") verifica esse resultado **depois** que
relatório, resumo, artefatos e comentário no PR já foram publicados, e só
então falha o job (`exit 1`) se necessário. Assim a pipeline sempre publica
o relatório, e ainda reporta corretamente sucesso/falha do job.

### 5. `.gitignore` ausente

Artefatos gerados (`node_modules/`, `coverage/`, `junit.xml`, `site/`)
podiam acabar sendo versionados acidentalmente. Foi adicionado um
`.gitignore` cobrindo esses diretórios/arquivos.

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
