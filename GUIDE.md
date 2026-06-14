# 📚 Guia Completo: CI/CD com Testes Automatizados
## Mapeamento Detalhado do Trabalho de Conclusão de Disciplina

Este documento é um guia passo a passo que explica cada ponto do trabalho de conclusão, como foi implementado e por que.

---

## 📋 Índice

1. [Objetivo Principal](#objetivo-principal)
2. [Formas de Disparo](#formas-de-disparo)
3. [Configurar Relatório](#configurar-relatório)
4. [Documentação README](#documentação-readme)
5. [Regras Obrigatórias](#regras-obrigatórias)
6. [Validação e Execução](#validação-e-execução)

---

## 🎯 Objetivo Principal

### O que é?

Configurar uma **pipeline de CI/CD (Integração Contínua/Entrega Contínua)** para um projeto que executa testes automatizados.

### Por que?

- **Qualidade**: Garante que o código funciona antes de ser publicado
- **Confiabilidade**: Erros são encontrados automaticamente, não em produção
- **Eficiência**: Elimina tarefas manuais repetitivas
- **Segurança**: Valida cada mudança antes de aceitar

### O que você ganha?

✅ Código sempre testado  
✅ Deploy seguro e rápido  
✅ Menos bugs em produção  
✅ Equipe mais produtiva  

### Como foi implementado neste projeto?

```bash
# Dois workflows principais foram criados:

.github/workflows/
├── tests.yml          # Executa testes automaticamente
└── pages.yml          # Publica site após testes passarem
```

---

## 🔄 Formas de Disparo

### O que é?

São os **eventos que acionam** a pipeline automaticamente. A pipeline pode rodar quando:

### 1. **Disparo Manual (workflow_dispatch)**

#### O que é?
Você clica um botão na interface do GitHub para rodar a pipeline manualmente.

#### Como implementar?

No arquivo `.github/workflows/tests.yml`:

```yaml
on:
  workflow_dispatch:  # ← Ativa disparo manual
```

#### Por que?
- Testar pipeline sem fazer commit
- Rodar testes em branches antigas
- Controle manual quando necessário

#### Ganhos?
⏱️ Não precisa fazer commit para testar  
🎮 Controle total sobre quando rodar  
🔍 Debug problemas específicos rapidamente  

#### Como usar?
1. Vá para GitHub > Actions
2. Selecione "Testes Automatizados"
3. Clique "Run workflow"
4. Escolha a branch
5. Clique "Run workflow"

---

### 2. **Disparo Agendado (schedule/cron)**

#### O que é?
A pipeline roda automaticamente em um horário específico (como uma tarefa agendada do Windows).

#### Como implementar?

No arquivo `.github/workflows/tests.yml`:

```yaml
on:
  schedule:
    - cron: '0 10 * * 1'  # Segunda-feira 10:00 UTC
```

**Formato Cron explicado:**
```
┌───────────── minuto (0-59)
│ ┌───────────── hora (0-23)
│ │ ┌───────────── dia do mês (1-31)
│ │ │ ┌───────────── mês (1-12)
│ │ │ │ ┌───────────── dia da semana (0-6, 0=domingo)
│ │ │ │ │
│ │ │ │ │
0 10 * * 1  ← Segunda-feira 10:00 UTC
```

#### Por que?
- Garantir qualidade mesmo sem novos commits
- Validar dependências regularmente
- Detectar problemas intermitentes

#### Ganhos?
📅 Validação contínua, mesmo sem mudanças  
🐛 Detecta problemas com dependências externas  
📊 Histórico de execuções periódicas  

#### Exemplos de agendamento:

```yaml
# Diariamente às 9:00 AM
- cron: '0 9 * * *'

# A cada hora
- cron: '0 * * * *'

# Sextas à noite (18:00)
- cron: '0 18 * * 5'

# Primeiro dia do mês
- cron: '0 0 1 * *'
```

---

### 3. **Disparo por Push (push)**

#### O que é?
A pipeline roda automaticamente toda vez que você faz `git push` para a branch.

#### Como implementar?

No arquivo `.github/workflows/tests.yml`:

```yaml
on:
  push:
    branches:
      - main       # Roda quando faz push para main
      - develop    # Roda quando faz push para develop
```

#### Por que?
- Validar código antes de aceitar
- Impedir código quebrado em produção
- Feedback imediato ao desenvolvedor

#### Ganhos?
⚡ Feedback em segundos após push  
🛡️ Bloqueia código com problemas  
👥 Todos recebem notificação de falhas  

#### Como usar?

```bash
# Você faz mudanças localmente
echo "novo código" >> app.js

# Commit e push normalmente
git add app.js
git commit -m "feat: novo recurso"
git push origin main

# GitHub Actions roda automaticamente ✅
# Você recebe notificação do resultado
```

---

### 4. **Disparo por Pull Request (pull_request)**

#### O que é?
A pipeline roda automaticamente quando alguém abre ou atualiza um Pull Request.

#### Como implementar?

No arquivo `.github/workflows/tests.yml`:

```yaml
on:
  pull_request:
    branches:
      - main
      - develop
```

#### Por que?
- Validar código ANTES de fazer merge
- Proteger branches principais
- Code review automatizado

#### Ganhos?
✔️ Garante que PRs sempre têm código testado  
👀 Reviewers veem resultado de testes automaticamente  
🔐 Impede merge de código com falhas  

#### Como usar?

```bash
# Você cria um PR
git push origin feature/nova-funcionalidade

# Abra PR no GitHub
# GitHub Actions roda automaticamente
# Resultado fica visível no PR
```

---

## 📊 Configurar Relatório

### O que é?

Um **relatório detalhado** dos testes, armazenado para você consultar depois.

### Por que?

- Ver histórico de testes
- Analisar tendências
- Identificar problemas recorrentes
- Comprovar qualidade do código

### O que você ganha?

📈 Histórico completo de testes  
🔍 Análise de cobertura de código  
📋 Documentação executável  

### Como foi implementado?

#### 1. Framework de Testes: Jest

No `package.json`:

```json
{
  "devDependencies": {
    "jest": "^29.7.0"
  },
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
}
```

**O que é Jest?**
- Framework para escrever testes em JavaScript
- Rápido e fácil de usar
- Gera relatórios de cobertura

**Por que Jest?**
✅ Popular e bem documentado  
✅ Zero configuração inicial  
✅ Relatórios visuais  

#### 2. Testes no Workflow

No `.github/workflows/tests.yml`:

```yaml
steps:
  - name: Instalar dependências
    run: npm install

  - name: Executar testes
    run: npm test -- --coverage
```

**O que faz?**
- Instala bibliotecas necessárias
- Roda todos os testes
- Gera relatório de cobertura

#### 3. Upload de Artefatos

No `.github/workflows/tests.yml`:

```yaml
- name: Upload de artefatos
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: |
      coverage/
      junit.xml
    retention-days: 30  # Guarda por 30 dias
```

**O que faz?**
- Salva relatórios de teste
- Guarda por 30 dias
- Você pode baixar e analisar

**Por que?**
- Rastreabilidade histórica
- Compliance e auditoria
- Análise de tendências

**Como acessar?**
1. GitHub > Actions
2. Selecione a execução do workflow
3. Scroll para baixo > "Artifacts"
4. Download do relatório

#### 4. Comentar no PR

No `.github/workflows/tests.yml`:

```yaml
- name: Comentar resultado no PR
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: `## Testes\n\n✅ PASSOU`
      });
```

**O que faz?**
- Posta comentário automático no PR
- Mostra se testes passaram/falharam
- Reviewers veem resultado

**Ganhos?**
💬 Feedback visual no PR  
👥 Todos sabem o resultado  
📢 Comunicação automática  

---

## 📖 Documentação README

### O que é?

Um **guia completo** explicando a pipeline e como usar.

### Por que?

- Desenvolvedores entendem o fluxo
- Novos membros da equipe aprendem rápido
- Documentação = menos dúvidas

### O que você ganha?

📚 Referência centralizada  
🎓 Onboarding mais rápido  
❓ Menos perguntas repetidas  

### Estrutura da Documentação

O README deste projeto inclui:

#### 1. **O que é CI/CD?**
```markdown
CI/CD (Continuous Integration / Continuous Deployment) é um conjunto 
de práticas que automatizam o processo de:
- Integração: testar automaticamente
- Entrega: preparar para produção
- Deploy: publicar automaticamente
```

**Por que?**
- Explica conceito
- Contextualiza o trabalho
- Educa o leitor

#### 2. **O que é GitHub Actions?**
```markdown
GitHub Actions é a ferramenta nativa do GitHub para automatizar fluxos.
É como um "robô" que executa scripts baseado em eventos.
```

**Por que?**
- Apresenta a ferramenta
- Explica como funciona
- Desmitifica a tecnologia

#### 3. **Benefícios e Ganhos**
```markdown
Para Desenvolvimento:
- Feedback rápido
- Menos bugs
- Segurança

Para a Equipe:
- Menos reuniões
- Menos trabalho manual
- Documentação viva

Para o Projeto:
- Qualidade consistente
- Histórico completo
- Rastreabilidade
```

**Por que?**
- Motiva uso da pipeline
- Mostra valor real
- Justifica investimento

#### 4. **Estrutura das Pipelines**
```markdown
| Workflow | Quando roda | O que faz |
|----------|-------------|----------|
| tests.yml | Push, PR, Manual, Agendado | Roda testes |
| pages.yml | Push main, Manual | Deploy se testes passarem |
```

**Por que?**
- Explicação visual
- Fácil de entender
- Referência rápida

#### 5. **Como Executar Localmente**
```markdown
1. npm install
2. npm test
3. npm run test:coverage
4. npm run build:catalog
5. npm run serve
```

**Por que?**
- Desenvolvedores podem validar localmente
- Menos surpresas no CI/CD
- Feedback mais rápido

---

## ✅ Regras Obrigatórias

### 1. Trabalho Individual

#### O que significa?
Você é responsável sozinho pelo trabalho. Sem cópias ou plágio.

#### Como garantir?
✔️ Fizer suas próprias commits  
✔️ Usar seu próprio repositório  
✔️ Explicar o que você fez  

#### Ganhos?
🎓 Aprende de verdade  
💼 Portfólio autêntico  
🏆 Maturidade profissional  

---

### 2. Utilizar GitHub Actions

#### O que é?
Serviço nativo do GitHub para automação. Não usar Jenkins, GitLab CI, etc.

#### Por que GitHub Actions?
✅ Integrado no GitHub  
✅ Grátis para repositórios públicos  
✅ Simples de configurar  
✅ Documentação excelente  

#### Como garantir?

Arquivo obrigatório: `.github/workflows/tests.yml`

```yaml
name: Testes Automatizados
on: [push, pull_request, workflow_dispatch, schedule]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm test
```

---

### 3. Testes e Pipe Executando com Sucesso

#### O que significa?
- ✅ Testes passam localmente
- ✅ Workflow não falha no GitHub
- ✅ Deploy acontece sem erros

#### Como garantir?

```bash
# Localmente
npm test  # Deve passar

# GitHub Actions
# Workflow status deve ser ✅ green
```

#### Ganhos?
🟢 Confiança no código  
🚀 Deploy sem medo  
👥 Equipe tranquila  

---

### 4. Relatório Armazenado na Pipe

#### O que é?
Salvar resultados de testes para consultar depois.

#### Como implementar?

```yaml
- name: Upload Artefatos
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: coverage/
    retention-days: 30
```

#### Ganhos?
📈 Histórico de testes  
🔍 Análise de tendências  
📋 Compliance  

---

### 5. Utilizar Adequadamente os Conceitos

#### O que significa?
- ✅ Entender CI/CD
- ✅ Aplicar corretamente
- ✅ Não apenas copiar

#### Como garantir?

```
✅ Documentação explica cada conceito
✅ Código tem comentários
✅ README educativo
✅ Você consegue explicar em voz alta
```

#### Ganhos?
🧠 Conhecimento real  
💼 Valor no mercado  
🎓 Aprendizado profundo  

---

### 6. Utilizar Ferramentas Adequadamente

#### Ferramentas Utilizadas

| Ferramenta | Função | Por que |
|-----------|---------|--------|
| Jest | Framework de testes | Simples, rápido, visual |
| GitHub Actions | Orquestração | Nativo, grátis, integrado |
| Node.js | Runtime JavaScript | Suporta Jest |
| Python | Build catalog | Já no projeto |

#### Como garantir?
✔️ Cada ferramenta tem propósito claro  
✔️ Configuradas corretamente  
✔️ Documentadas no README  

---

### 7. Documentação Adequada no README

#### O que é?
README.md com explicações completas e claras.

#### Estrutura Esperada

```markdown
# 🚀 Título do Projeto

## 📚 CI/CD com GitHub Actions

### O que é CI/CD?
[Explicação clara]

### O que é GitHub Actions?
[Explicação clara]

### Benefícios
[Lista de ganhos]

### Como executar localmente
[Passo a passo]

### Estrutura das Pipelines
[Diagrama ou tabela]

### Como visualizar resultados
[Instruções]
```

#### Ganhos?
📖 Documentação viva  
🎓 Educativa  
👥 Acessível para todos  

---

## 🔍 Validação e Execução

### Checklist Final

✅ **Objetivo**
- [ ] Pipeline configurada
- [ ] Testes rodam automaticamente

✅ **Formas de Disparo**
- [ ] Manual (workflow_dispatch)
- [ ] Agendado (cron)
- [ ] Push
- [ ] Pull Request

✅ **Relatório**
- [ ] Framework de testes (Jest)
- [ ] Artefatos salvos
- [ ] Comentários em PRs

✅ **Documentação**
- [ ] README completo
- [ ] Explica conceitos
- [ ] Instruções locais

✅ **Regras**
- [ ] Trabalho individual
- [ ] GitHub Actions
- [ ] Testes passando
- [ ] Relatório armazenado
- [ ] Conceitos bem utilizados
- [ ] Ferramentas adequadas
- [ ] Documentação clara

---

## 🚀 Como Executar Este Projeto

### Pré-requisitos
- Node.js 18+
- Python 3.12+
- Git

### 1. Clonar
```bash
git clone https://github.com/ricardosantosqa/usadosdequalidade.git
cd usadosdequalidade
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Executar Testes Localmente
```bash
# Uma vez
npm test

# Com cobertura
npm run test:coverage

# Em modo watch
npm run test:watch
```

### 4. Gerar Catálogo
```bash
npm run build:catalog
```

### 5. Servir Localmente
```bash
npm run serve
# Acesse http://localhost:8000
```

### 6. Visualizar Workflows
1. Faça push: `git push origin main`
2. Vá para: GitHub > Actions
3. Veja as pipelines executando
4. Clique para ver logs detalhados

---

## 📊 Arquitetura da Solução

```
┌─────────────────────────────────────────────────────────┐
│                   GitHub Actions                         │
└─────────────────────────────────────────────────────────┘
         │                            │
         ▼                            ▼
   ┌──────────────┐            ┌──────────────┐
   │ tests.yml    │            │ pages.yml    │
   │              │            │              │
   │ • Node Setup │            │ • Testes ✓   │
   │ • npm test   │            │ • Catalog    │
   │ • Cobertura  │            │ • Deploy     │
   │ • Artefatos  │            │ • GitHub     │
   └──────────────┘            │   Pages      │
         │                      └──────────────┘
         ▼                            │
   ┌──────────────┐                   ▼
   │ Relatórios   │            ┌──────────────┐
   │              │            │ Site Público │
   │ • Coverage   │            │ (GitHub      │
   │ • Junit      │            │  Pages)      │
   │ • Logs       │            └──────────────┘
   └──────────────┘
```

---

## 🎓 Conceitos Aplicados

### CI/CD
- ✅ Integração Contínua (Testes automáticos)
- ✅ Entrega Contínua (Deploy automático)

### DevOps
- ✅ Automação
- ✅ Monitoramento
- ✅ Feedback rápido

### Qualidade
- ✅ Testes
- ✅ Cobertura
- ✅ Relatórios

### Documentação
- ✅ README educativo
- ✅ Conceitos explicados
- ✅ Passo a passo

---

## 📞 Suporte e Dúvidas

Se tiver dúvidas sobre qualquer conceito:

1. **CI/CD**: Veja seção "O que é CI/CD?" no README
2. **GitHub Actions**: Veja seção "O que é GitHub Actions?"
3. **Testes**: Execute `npm test` localmente
4. **Workflows**: Veja `.github/workflows/`
5. **Logs**: GitHub > Actions > Selecione execução

---

## 📚 Referências

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Jest Documentation](https://jestjs.io/)
- [CI/CD Best Practices](https://martinfowler.com/articles/continuousIntegration.html)
- [GitHub Pages](https://docs.github.com/en/pages)

---

**Documento criado em**: 2026-06-11  
**Projeto**: Usados de Qualidade  
**Aluno**: Ricardo Santos  
**Disciplina**: Conclusão de Disciplina
