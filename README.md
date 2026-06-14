# 🛍️ Usados de Qualidade

Site estatico de vendas. Criado para uso como projeto de estudo em testes automatizados, CI/CD com GitHub Actions e deploy no GitHub Pages.

---

## Clonar o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd pgats-test-ci
```

## O Que Precisa Instalar

- Node.js 24 ou superior
- npm
- Python 3
- Playwright

Instale as dependencias do projeto:

```bash
npm install
```

Instale o navegador usado nos testes funcionais:

```bash
npx playwright install chromium
```

## Comandos Principais

Gerar o catalogo de produtos:

```bash
npm run build:catalog
```

Executar o site localmente:

```bash
npm run serve -- --bind 127.0.0.1
```

Acesse:

```text
http://127.0.0.1:8000
```

## Testes Locais Com Relatorios

### Testes Unitarios

Executa Jest com cobertura, JSON e JUnit:

```bash
npm run test:unit:ci -- --runInBand
```

Relatorios gerados:

| Arquivo/Pasta | Conteudo |
|---|---|
| `coverage/` | Relatorio de cobertura em HTML, LCOV e JSON |
| `coverage/index.html` | Relatorio HTML navegavel |
| `coverage/coverage-summary.json` | Resumo de cobertura |
| `reports/unit-results.json` | Resultado dos testes unitarios em JSON |
| `junit.xml` | Resultado JUnit usado pela esteira |

### Testes Funcionais

Executa Playwright em Chromium. O comando tambem gera o catalogo antes de iniciar os testes:

```bash
npm run test:functional
```

Relatorios gerados:

| Arquivo/Pasta | Conteudo |
|---|---|
| `reports/functional-results.json` | Resultado funcional em JSON |
| `reports/functional-junit.xml` | Resultado funcional em JUnit |
| `playwright-report/` | Relatorio HTML do Playwright |
| `test-results/` | Evidencias, traces e anexos quando houver falha |

Abrir o relatorio HTML do Playwright:

```bash
npx playwright show-report
```

### Todos os Testes

```bash
npm run test:ci
```

## Estrutura Do Projeto

```text
.
├── .github/workflows/
│   ├── tests.yml
│   └── pages.yml
├── products/
├── scripts/
│   ├── build_catalog.py
│   └── ci_test_summary.js
├── test/
│   ├── app.test.js
│   └── functional/catalog.spec.js
├── app.js
├── index.html
├── jest.config.js
├── package.json
├── playwright.config.js
└── styles.css
```

## Esteira CI/CD

O projeto usa dois workflows:

| Workflow | Arquivo | Responsabilidade |
|---|---|---|
| Testes Automatizados | `.github/workflows/tests.yml` | Validar codigo, gerar relatorios, publicar artefatos e enviar email |
| Deploy GitHub Pages | `.github/workflows/pages.yml` | Testar, preparar build estatico, publicar no GitHub Pages e enviar email |

## Workflow De Testes

O workflow `tests.yml` roda nestes cenarios:

| Gatilho | Quando roda |
|---|---|
| `push` | Push para `main` ou `develop` |
| `pull_request` | Pull Request contra `main` ou `develop` |
| `workflow_dispatch` | Execucao manual pelo GitHub Actions |
| `schedule` | Apenas no mês 6, aos Domingos, segundas e Quartas as 19:22 Horário de Brasília |

```yaml
schedule:
  - cron: '22 22 * 6 0,1,3'

```

Isso significa:

```text
22 22 * 6 0,1,3
|  |  | | |
|  |  | | +-- dias da semana: domingo, segunda, terca
|  |  | +---- mês de Junho
|  |  +------ qualquer dia do mes
|  +--------- 22h UTC
+----------- minuto 22
```

Como Sao Paulo usa UTC-3, `22h UTC` corresponde a `19h America/Sao_Paulo`.

### O Que Acontece Na Esteira De Testes

1. Faz checkout do repositorio.
2. Instala Node.js 24 com cache do npm.
3. Instala dependencias com `npm install`.
4. Gera `catalog.json` com `npm run build:catalog`.
5. Executa testes unitarios com Jest, cobertura e JUnit.
6. Publica o relatorio Jest na aba Checks.
7. Instala Chromium para o Playwright.
8. Executa testes funcionais com Playwright.
9. Publica o relatorio funcional na aba Checks.
10. Gera um resumo no GitHub Step Summary.
11. Faz upload dos artefatos da execucao.
12. Comenta o resultado em Pull Requests.
13. Envia notificacao por email.
14. No ultimo step, falha o job se unitarios ou funcionais falharam.

### Por Que Usamos `continue-on-error`

Os steps de teste usam `continue-on-error: true` de proposito.

Sem isso, quando um teste falha, o GitHub Actions para o job imediatamente e os passos seguintes podem nao rodar. O problema e que justamente esses passos seguintes geram os relatorios, fazem upload de artefatos e enviam email.

A solucao usada foi:

```yaml
- name: Executar testes unitarios com cobertura
  id: unit_tests
  continue-on-error: true
```

Depois, no final do job, existe um step chamado `Resultado final dos testes`:

```yaml
if [ "${{ steps.unit_tests.outcome }}" != "success" ] || [ "${{ steps.functional_tests.outcome }}" != "success" ]; then
  exit 1
fi
```

Com isso, a pipeline tem os dois comportamentos corretos:

- sempre gera relatorio, artefato e email;
- ainda assim falha no final quando algum teste falha.

### Por Que Usamos `if: always()`

Steps como resumo, upload de artefatos e email usam:

```yaml
if: always()
```

Esse conceito garante que o step rode mesmo quando algum step anterior falhou ou foi marcado como falha.

Ele e usado nos pontos em que a informacao da falha precisa ser publicada:

- Step Summary;
- upload de artefatos;
- comentario em Pull Request;
- notificacao por email;
- resultado final.

### Relatorios Publicados Pela Esteira De Testes

Toda execucao por push, manual ou agendada gera relatorios e tenta enviar email.

| Canal | Onde ver |
|---|---|
| Checks | Repositorio -> commit ou PR -> Checks |
| Step Summary | Repositorio -> Actions -> execucao -> Summary |
| Artefatos | Repositorio -> Actions -> execucao -> Artifacts |
| Comentario em PR | Pull Request correspondente |
| Email | Caixa configurada em `NOTIFICATION_EMAIL` ou email publico do owner |

Artefato gerado:

```text
test-report-<numero-da-execucao>
```

Conteudo do artefato:

```text
coverage/
junit.xml
reports/
playwright-report/
test-results/
```

O artefato fica armazenado por 30 dias.

## Notificacao Por Email

O step de email roda com `if: always()`, portanto e executado em push, Pull Request, manual e agendado.

Secrets necessarios em `Settings -> Secrets and variables -> Actions`:

| Secret | Obrigatorio | Exemplo |
|---|---|---|
| `SMTP_HOST` | Sim | `smtp.gmail.com` |
| `SMTP_PORT` | Nao | `587` ou `465` |
| `SMTP_USERNAME` | Sim | email usado no SMTP |
| `SMTP_PASSWORD` | Sim | senha ou app password |
| `NOTIFICATION_EMAIL` | Recomendado | email do dono do repositorio |
| `NOTIFICATION_FROM` | Nao | remetente exibido |

O GitHub nao fornece o email privado do dono do repositorio por seguranca. Por isso, a melhor opcao e cadastrar `NOTIFICATION_EMAIL` com o proprio email da conta.

Se `NOTIFICATION_EMAIL` nao existir, a esteira tenta usar o email publico do perfil GitHub do dono do repositorio. Se esse email nao estiver publico, o envio e ignorado com mensagem explicativa no log.

## Workflow De Deploy

O workflow `pages.yml` publica o site no GitHub Pages.

Ele roda em:

| Gatilho | Quando roda |
|---|---|
| `push` | Push para `main` |
| `workflow_dispatch` | Execucao manual |

Fluxo:

```text
test -> build -> deploy -> notify
```

### Job `test`

Executa a validacao antes de permitir o build:

- instala dependencias;
- gera catalogo;
- roda testes unitarios;
- instala Playwright;
- roda testes funcionais;
- publica artefatos;
- falha no final se algum teste falhar.

### Job `build`

Prepara uma pasta estatica chamada `site/` com os arquivos necessarios:

```text
index.html
styles.css
app.js
catalog.json
products/
logos/
```

Depois envia essa pasta como artefato do GitHub Pages.

### Job `deploy`

Usa `actions/deploy-pages` para publicar o artefato no GitHub Pages.

O deploy so acontece se o job `test` e o job `build` passarem. Esse encadeamento e feito com:

```yaml
needs: test
needs: build
```

### Job `notify`

Envia email com o resultado final do workflow de deploy em execucoes manuais e em push para `main`.

Esse job usa:

```yaml
needs:
  - test
  - build
  - deploy
if: always()
```

Assim, a notificacao roda mesmo quando testes, build ou deploy falham. O email informa o resultado de cada etapa, o link da execucao no GitHub Actions e, quando houver deploy publicado, a URL final do GitHub Pages.

## Conceitos Para Relembrar

| Conceito | Explicacao curta |
|---|---|
| Workflow | Arquivo YAML dentro de `.github/workflows/` |
| Trigger | Evento que inicia o workflow, como `push`, `schedule` ou manual |
| Job | Grupo de steps executado em um runner |
| Step | Comando ou action executado dentro de um job |
| Runner | Maquina virtual que executa o job |
| Action | Acao reutilizavel, como `actions/checkout` |
| Artifact | Arquivo/pasta salvo ao final da execucao para download |
| Checks | Area do GitHub que mostra resultado detalhado dos testes |
| Step Summary | Resumo em Markdown exibido na pagina da execucao |
| Secret | Variavel segura para guardar credenciais |
| `continue-on-error` | Permite continuar o job mesmo quando um step falha |
| `if: always()` | Forca um step a rodar mesmo apos falhas anteriores |
| `needs` | Define dependencia entre jobs |
| `cron` | Expressao de agendamento usada pelo `schedule` |



## Consulta Rapida

```bash
npm install
npx playwright install chromium
npm run build:catalog
npm run test:unit:ci -- --runInBand
npm run test:functional
npm run serve -- --bind 127.0.0.1
```

---

## 🌎 Sobre o autor
🐞 Caçador de bugs, guardião da qualidade e parceiro do time: antecipo problemas e reforço a qualidade reduzindo dor de cabeça em produção.

Projeto mantido por **Ricardo Santos** — QA Engineer

Foco em:
* Qualidade de software
* Automação de testes
* Testes Web, API e Mobile
* Observabilidade

🌐 [santosqa.github.io](https://santosqa.github.io)👋🏼

---

[![AWS](https://img.shields.io/badge/AWS-Simulado%20CERTIFICAÇÃO%20CLF-%23FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://simuladoawsclf.pages.dev/) [![Santos Links](https://img.shields.io/badge/GitHub-Santos%20Links-%23FFD700?style=for-the-badge&logo=github&logoColor=white)](https://santosqa.github.io) [![GitHub](https://img.shields.io/badge/GitHub-About.me-%2350fa7b?style=for-the-badge&logo=github&logoColor=white)](https://github.com/santosqa) [![LinkedIn](https://img.shields.io/badge/LinkedIn>-SantosQA-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/santosqa) [![Instagram](https://img.shields.io/badge/>-instagram-%23ff5555.svg?&style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/santosqa_/) [![Santos QA](https://img.shields.io/badge/www-santosqa.com-%23bd93f9.svg?&style=for-the-badge&logo=firefox-browser&logoColor=white)](https://www.santosqa.com) [![Apartamento Vista Mar](https://img.shields.io/badge/www-ApartamentoVistaMar.com-%238be9fd.svg?&style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.apartamentovistamar.com/) [![Receitas Nerds](https://img.shields.io/badge/GitHub-Receitas%20Nerds-%23ffb86c?style=for-the-badge&logo=github&logoColor=white)](https://santosqa.github.io/receitas/) [![Santos Locais Turisticos](https://img.shields.io/badge/GitHub-Santos%20Locais%20Turísticos-%23ff79c6?style=for-the-badge&logo=github&logoColor=white)](https://santosqa.github.io/santos-locais-turisticos/)

##